# 学习React Hooks

React Hooks是React 16.8引入的新特性，它允许你在不编写class的情况下使用state和其他React特性。

## 基础Hook
- useState
- useEffect
- useContext

## 自定义Hook
可以通过组合现有Hook来创建自定义Hook，实现逻辑复用。

```js
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```