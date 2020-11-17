# html2vNode

## View

![alt](https://s3.ax1x.com/2020/11/17/DVWwo4.jpg)

## Install

with cdn

```javascript
<script src="https://cdn.jsdelivr.net/npm/html2vnode@1.0.0/dist/how-long-till-lunch.esm.js"></script>
```

with npm

> When i have fucking time to fucking write

## Use it

```javascript
var body = document.body;
var tree = new vTree(body);
```

## APIS

vNode Prototypes

|  Field   | type  | default |
|  ----  | ----  | ---- |
| getTagName  | function() -> tagName | - |
| setProps  | funtion({ k: v }) -> void | - |
| stanardStyle  | funtion() -> void | - |
| setPropsStyle  | funtion({ k: v }) -> void | - |
| setText  | funtion(str) -> void | - |
| render  | funtion() -> DOM | - |

vTree Prototypes

ps: vTree follow functor rules

|  Field   | type  | default |
|  ----  | ----  | ---- |
| getVTree  | function() -> vTree | - |

## License

[MIT](LICENSE).1839333350@qq.com
