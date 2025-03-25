`Boost.Asio` 是一个用于网络编程和并发处理的 C++ 库，它为 TCP、UDP、HTTP、串行端口等提供异步操作。通过 `Boost.Asio`，开发者可以轻松实现高性能网络服务器和客户端应用。下面是一些使用 `Boost.Asio` 的详细案例，包括同步和异步操作。

### 1. **TCP 同步客户端**

这个简单的同步 TCP 客户端连接到服务器并发送一条消息，然后接收服务器的响应。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;

int main() {
    try {
        // 创建io_context对象
        boost::asio::io_context io_context;

        // 解析服务器地址和端口
        tcp::resolver resolver(io_context);
        tcp::resolver::results_type endpoints = resolver.resolve("localhost", "8080");

        // 创建并连接socket
        tcp::socket socket(io_context);
        boost::asio::connect(socket, endpoints);

        // 构造要发送的消息
        std::string message = "Hello from client!";
        boost::asio::write(socket, boost::asio::buffer(message));

        // 接收服务器的回复
        char reply[128];
        size_t reply_length = boost::asio::read(socket, boost::asio::buffer(reply, message.size()));

        // 输出服务器的回复
        std::cout << "Reply from server: " << std::string(reply, reply_length) << std::endl;

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### 2. **TCP 同步服务器**

这是一个同步 TCP 服务器，它监听特定端口，接受客户端连接并回显客户端发送的消息。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;

int main() {
    try {
        // 创建io_context对象
        boost::asio::io_context io_context;

        // 监听8080端口
        tcp::acceptor acceptor(io_context, tcp::endpoint(tcp::v4(), 8080));

        while (true) {
            // 等待并接受客户端连接
            tcp::socket socket(io_context);
            acceptor.accept(socket);

            // 读取客户端发来的消息
            char data[128];
            size_t length = socket.read_some(boost::asio::buffer(data));

            // 回显客户端的消息
            boost::asio::write(socket, boost::asio::buffer(data, length));
        }
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### 3. **TCP 异步客户端**

异步操作可以提高并发性能。下面是一个异步 TCP 客户端的实现，它使用回调函数进行异步通信。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;

void on_write(const boost::system::error_code& /*error*/, size_t /*bytes_transferred*/) {
    std::cout << "Message sent!" << std::endl;
}

void on_connect(const boost::system::error_code& error, tcp::socket& socket) {
    if (!error) {
        std::string message = "Hello from async client!";
        boost::asio::async_write(socket, boost::asio::buffer(message), on_write);
    } else {
        std::cerr << "Connect failed: " << error.message() << std::endl;
    }
}

int main() {
    try {
        boost::asio::io_context io_context;
        tcp::resolver resolver(io_context);
        tcp::resolver::results_type endpoints = resolver.resolve("localhost", "8080");

        tcp::socket socket(io_context);
        boost::asio::async_connect(socket, endpoints, [&socket](const boost::system::error_code& error, const tcp::endpoint&) {
            on_connect(error, socket);
        });

        io_context.run();

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### 4. **TCP 异步服务器**

这是一个异步 TCP 服务器，它处理客户端的连接并使用回调函数来读取和回显消息。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;

class AsyncServer {
public:
    AsyncServer(boost::asio::io_context& io_context, short port)
        : acceptor_(io_context, tcp::endpoint(tcp::v4(), port)) {
        start_accept();
    }

private:
    void start_accept() {
        tcp::socket socket(acceptor_.get_executor().context());
        acceptor_.async_accept([this, &socket](const boost::system::error_code& error) {
            if (!error) {
                start_read(std::move(socket));
            }
            start_accept();
        });
    }

    void start_read(tcp::socket socket) {
        auto data = std::make_shared<std::array<char, 128>>();
        socket.async_read_some(boost::asio::buffer(*data), [this, socket = std::move(socket), data](const boost::system::error_code& error, size_t length) mutable {
            if (!error) {
                start_write(std::move(socket), data, length);
            }
        });
    }

    void start_write(tcp::socket socket, std::shared_ptr<std::array<char, 128>> data, size_t length) {
        boost::asio::async_write(socket, boost::asio::buffer(*data, length), [this, socket = std::move(socket)](const boost::system::error_code& error, size_t) {
            if (!error) {
                start_read(std::move(socket));
            }
        });
    }

    tcp::acceptor acceptor_;
};

int main() {
    try {
        boost::asio::io_context io_context;
        AsyncServer server(io_context, 8080);
        io_context.run();
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### 5. **UDP 同步客户端**

UDP 是无连接的，以下示例展示了一个简单的同步 UDP 客户端，它向服务器发送消息并接收响应。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::udp;

int main() {
    try {
        boost::asio::io_context io_context;

        udp::resolver resolver(io_context);
        udp::endpoint receiver_endpoint = *resolver.resolve(udp::v4(), "localhost", "8080").begin();

        udp::socket socket(io_context);
        socket.open(udp::v4());

        std::string message = "Hello from UDP client!";
        socket.send_to(boost::asio::buffer(message), receiver_endpoint);

        char reply[128];
        udp::endpoint sender_endpoint;
        size_t reply_length = socket.receive_from(boost::asio::buffer(reply), sender_endpoint);

        std::cout << "Reply from server: " << std::string(reply, reply_length) << std::endl;

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

### 6. **UDP 同步服务器**

这是一个同步 UDP 服务器，它接收客户端消息并回显给客户端。

```cpp
#include <iostream>
#include <boost/asio.hpp>

using boost::asio::ip::udp;

int main() {
    try {
        boost::asio::io_context io_context;

        udp::socket socket(io_context, udp::endpoint(udp::v4(), 8080));

        while (true) {
            char data[128];
            udp::endpoint sender_endpoint;
            size_t length = socket.receive_from(boost::asio::buffer(data), sender_endpoint);

            socket.send_to(boost::asio::buffer(data, length), sender_endpoint);
        }
    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
```

------

以上展示了 `Boost.Asio` 的一些典型用例，包括同步和异步 TCP/UDP 的客户端和服务器。通过 `Boost.Asio`，可以轻松实现高效的异步通信。