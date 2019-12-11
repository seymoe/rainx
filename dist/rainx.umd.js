/*!
 * AnyTouch.js v1.0.0
 * (c) 2019-2019 Seymoe
 * https://github.com/seymoe/rainx
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.rainx = factory());
}(this, (function () { 'use strict';

  /**
   * vNode type Types
   */
  var VnodeFlags;
  (function (VnodeFlags) {
      // 正常的html节点
      VnodeFlags[VnodeFlags["HTML"] = 0] = "HTML";
      // svg节点
      VnodeFlags[VnodeFlags["SVG"] = 1] = "SVG";
      // 文本节点
      VnodeFlags[VnodeFlags["TEXT"] = 2] = "TEXT";
      // 一系列节点
      VnodeFlags[VnodeFlags["FRAGMENT"] = 3] = "FRAGMENT";
      // 传送门
      VnodeFlags[VnodeFlags["PORTAL"] = 4] = "PORTAL";
      // 函数式组件
      VnodeFlags[VnodeFlags["COMPONENT_FUNCTIONAL"] = 5] = "COMPONENT_FUNCTIONAL";
      // 类组件
      VnodeFlags[VnodeFlags["COMPONENT_STATEFUL"] = 6] = "COMPONENT_STATEFUL";
  })(VnodeFlags || (VnodeFlags = {}));
  /**
   * children types Type
   */
  var ChildrenFlags;
  (function (ChildrenFlags) {
      ChildrenFlags[ChildrenFlags["UNKNOW_CHILDREN"] = 0] = "UNKNOW_CHILDREN";
      ChildrenFlags[ChildrenFlags["NO_CHILDREN"] = 1] = "NO_CHILDREN";
      ChildrenFlags[ChildrenFlags["SINGLE_VNODE"] = 2] = "SINGLE_VNODE";
      ChildrenFlags[ChildrenFlags["KEYED_VNODES"] = 3] = "KEYED_VNODES";
      ChildrenFlags[ChildrenFlags["NONE_KEYED_VNODES"] = 4] = "NONE_KEYED_VNODES";
  })(ChildrenFlags || (ChildrenFlags = {}));

  // Fragment Flag
  var FRAGMENT = Symbol('FRAGMENT');
  var PORTAL = Symbol('PORTAL');
  // 创建文本节点
  var createTextNode = function (text) {
      return {
          el: null,
          _isVNode: true,
          tag: null,
          data: null,
          children: text,
          flags: VnodeFlags.TEXT,
          childrenFlags: ChildrenFlags.NO_CHILDREN
      };
  };
  // 创建 VNode 辅助函数
  var h = function (tag, data, children) {
      // 确定 flags 的值
      var flags = null;
      if (typeof tag === 'string') {
          flags = tag === 'svg' ? VnodeFlags.SVG : VnodeFlags.HTML;
      }
      else if (tag === FRAGMENT) {
          flags = VnodeFlags.FRAGMENT;
      }
      else if (tag === PORTAL) {
          flags = VnodeFlags.PORTAL;
          tag = data && data.target;
      }
      else if (typeof tag === 'function') {
          if (tag.prototype && tag.prototype.render) {
              flags = VnodeFlags.COMPONENT_STATEFUL;
          }
          else {
              flags = VnodeFlags.COMPONENT_FUNCTIONAL;
          }
      }
      // 确定 childrenFlags 的值
      var childrenFlags = null;
      // 如果 children 是数组
      if (Array.isArray(children)) {
          var len = children.length;
          if (len === 0) {
              // 无子节点
              childrenFlags = ChildrenFlags.NO_CHILDREN;
          }
          else if (len === 1) {
              // 单子节点
              childrenFlags = ChildrenFlags.SINGLE_VNODE;
          }
          else {
              // 多个子节点，需要区分有 key 和无 key 的情况
              childrenFlags = ChildrenFlags.KEYED_VNODES;
          }
      }
      else if (children == null) {
          // 无子节点
          childrenFlags = ChildrenFlags.NO_CHILDREN;
      }
      else if (children._isVNode) {
          // 单个子节点
          childrenFlags = ChildrenFlags.SINGLE_VNODE;
      }
      else {
          // 其他情况视为文本节点
          childrenFlags = ChildrenFlags.SINGLE_VNODE;
          // 调用 createTextVNode 创建纯文本类型的 VNode
          children = createTextNode('' + children);
      }
      return {
          el: null,
          _isVNode: true,
          tag: tag,
          data: data,
          children: children,
          flags: flags,
          childrenFlags: childrenFlags
      };
  };

  var rainx = {
      h: h,
      createElement: h
  };

  return rainx;

})));
//# sourceMappingURL=rainx.umd.js.map
