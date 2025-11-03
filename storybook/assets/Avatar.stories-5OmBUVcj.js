import{r as x,j as a}from"./iframe-D-w6RxGv.js";import{c as n}from"./clsx-B-dksMZM.js";import{u as f}from"./useStyles-Cd9RkdK8.js";import{A as m,a as h,b as _}from"./AvatarFallback-BDfo7HMA.js";import{F as j}from"./Flex-BiQL9uGd.js";import"./preload-helper-D9Z9MdNV.js";import"./noop-COpaa_xs.js";const i={"bui-AvatarRoot":"_bui-AvatarRoot_odwvx_20","bui-AvatarImage":"_bui-AvatarImage_odwvx_52","bui-AvatarFallback":"_bui-AvatarFallback_odwvx_58"},r=x.forwardRef((t,c)=>{const{classNames:e,dataAttributes:u,cleanedProps:p}=f("Avatar",{size:"medium",...t}),{className:d,src:A,name:g,...v}=p;return a.jsxs(m,{ref:c,className:n(e.root,i[e.root],d),...u,...v,children:[a.jsx(h,{className:n(e.image,i[e.image]),src:A}),a.jsx(_,{className:n(e.fallback,i[e.fallback]),children:(g||"").split(" ").map(b=>b[0]).join("").toLocaleUpperCase("en-US").slice(0,2)})]})});r.displayName=m.displayName;r.__docgenInfo={description:"@public",methods:[],props:{src:{required:!0,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | 'large'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"literal",value:"'large'"}]},description:""}}};const w={title:"Backstage UI/Avatar",component:r},s={args:{src:"https://avatars.githubusercontent.com/u/1540635?v=4",name:"Charles de Dreuille"}},o={args:{...s.args,src:"https://avatars.githubusercontent.com/u/15406AAAAAAAAA"}},l={args:{...s.args},render:t=>a.jsxs(j,{children:[a.jsx(r,{...t,size:"small"}),a.jsx(r,{...t,size:"medium"}),a.jsx(r,{...t,size:"large"})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    src: 'https://avatars.githubusercontent.com/u/1540635?v=4',
    name: 'Charles de Dreuille'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    src: 'https://avatars.githubusercontent.com/u/15406AAAAAAAAA'
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  render: args => <Flex>
      <Avatar {...args} size="small" />
      <Avatar {...args} size="medium" />
      <Avatar {...args} size="large" />
    </Flex>
}`,...l.parameters?.docs?.source}}};const I=["Default","Fallback","Sizes"];export{s as Default,o as Fallback,l as Sizes,I as __namedExportsOrder,w as default};
