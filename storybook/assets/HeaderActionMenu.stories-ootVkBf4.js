import{aC as y,aD as f,aE as b,aF as v,a1 as I,u as L,r as m,j as e,K as M}from"./iframe-M9O-K8SB.js";import{P as x}from"./Popover-9y8CeMZr.js";import{L as g}from"./List-DFXlWgcm.js";import{L as E}from"./ListItem-CccU-wMK.js";import{L as h}from"./ListItemIcon-C0tJWs3p.js";import{L as T}from"./ListItemText-OpvVVx-v.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./ListContext-CQy2fJuy.js";var i={},c;function q(){if(c)return i;c=1;var r=y(),s=f();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var n=s(b()),o=r(v()),a=(0,o.default)(n.createElement("path",{d:"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"}),"MoreVert");return i.default=a,i}var j=q();const H=I(j),P=({label:r,secondaryLabel:s,icon:n,disabled:o=!1,onClick:a})=>e.jsx(m.Fragment,{children:e.jsxs(E,{"data-testid":"header-action-item",disabled:o,button:!0,onClick:l=>{a&&a(l)},children:[n&&e.jsx(h,{children:n}),e.jsx(T,{primary:r,secondary:s})]})});function d(r){const{palette:{common:{white:s}}}=L(),{actionItems:n}=r,[o,a]=m.useState(!1),l=m.useRef(null);return e.jsxs(m.Fragment,{children:[e.jsx(M,{onClick:()=>a(!0),"data-testid":"header-action-menu",ref:l,style:{color:s,height:56,width:56,marginRight:-4,padding:0},children:e.jsx(H,{})}),e.jsx(x,{open:o,anchorEl:l.current,anchorOrigin:{horizontal:"right",vertical:"bottom"},transformOrigin:{horizontal:"right",vertical:"top"},onClose:()=>a(!1),children:e.jsx(g,{children:n.map((u,p)=>e.jsx(P,{...u},`header-action-menu-${p}`))})})]})}d.__docgenInfo={description:"@public",methods:[],displayName:"HeaderActionMenu",props:{actionItems:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label?: ListItemTextProps['primary'];
  secondaryLabel?: ListItemTextProps['secondary'];
  icon?: ReactElement;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}`,signature:{properties:[{key:"label",value:{name:"ListItemTextProps['primary']",raw:"ListItemTextProps['primary']",required:!1}},{key:"secondaryLabel",value:{name:"ListItemTextProps['secondary']",raw:"ListItemTextProps['secondary']",required:!1}},{key:"icon",value:{name:"ReactElement",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLElement"}],raw:"MouseEvent<HTMLElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}}],raw:"HeaderActionMenuItem[]"},description:""}}};const F={title:"Layout/HeaderActionMenu",component:d,tags:["!manifest"]},t=r=>e.jsx(d,{...r});t.args={actionItems:[{label:"Item 1",secondaryLabel:"Item 1 secondary label",disabled:!1},{label:"Item 2",secondaryLabel:"Item 2 secondary label",disabled:!0},{label:"Item 3",secondaryLabel:"Item 3 secondary label",disabled:!0}]};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{actionItems:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  label?: ListItemTextProps['primary'];
  secondaryLabel?: ListItemTextProps['secondary'];
  icon?: ReactElement;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}`,signature:{properties:[{key:"label",value:{name:"ListItemTextProps['primary']",raw:"ListItemTextProps['primary']",required:!1}},{key:"secondaryLabel",value:{name:"ListItemTextProps['secondary']",raw:"ListItemTextProps['secondary']",required:!1}},{key:"icon",value:{name:"ReactElement",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}},{key:"onClick",value:{name:"signature",type:"function",raw:"(event: MouseEvent<HTMLElement>) => void",signature:{arguments:[{type:{name:"MouseEvent",elements:[{name:"HTMLElement"}],raw:"MouseEvent<HTMLElement>"},name:"event"}],return:{name:"void"}},required:!1}}]}}],raw:"HeaderActionMenuItem[]"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const Default = () => (
  <HeaderActionMenu
    actionItems={[
      {
        label: "Item 1",
        secondaryLabel: "Item 1 secondary label",
        disabled: false,
      },
      {
        label: "Item 2",
        secondaryLabel: "Item 2 secondary label",
        disabled: true,
      },
      {
        label: "Item 3",
        secondaryLabel: "Item 3 secondary label",
        disabled: true,
      },
    ]}
  />
);
`,...t.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"(args: HeaderActionMenuProps) => <HeaderActionMenu {...args} />",...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,F as default};
