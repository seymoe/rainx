# Rainx

#### A React & Vue Like JavaScript Library For Building User Interfaces.

1. 组件的产出就是 Virtual DOM
2. VNode的类型分为：HTML/SVG、Text、FRAGMENT、PORTAL、COMPONENNT_FUNCTIONIAL、COMPONENT_STATEFUL
3. VNode是虚拟节点，VNodeData是对节点的描述，可通过 h 辅助函数进行创建，通过 render 函数将 VNodeData 挂载在真实的DOM中
4. render 非常重要，原理为通过判断不同的 vnode 类型进行相应的挂载操作，同时需要处理属性、事件等
5. patch 过程中，不同类型的vnode比较没有意义，可直接替换
6. patch 过程中，同类型的vnode，html类型是比较 tag 和 data，文本节点是比较文本值，子节点更新通过递归进行
