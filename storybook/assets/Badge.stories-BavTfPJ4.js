import{bg as x,ca as f,cH as h,bR as e,c7 as b}from"./iframe-DogXi1kP.js";import{Y as d}from"./index-RV6Ph9vd.js";import{F as m}from"./Flex-Bi-SKTgz.js";import{B as z}from"./BUIProvider-coEk1xkK.js";import"./preload-helper-PPVm8Dsz.js";import"./openLink-CxuZpafj.js";import"./useResolvedHref-BFQ7w248.js";const j={"bui-Badge":"_bui-Badge_an6rw_20","bui-BadgeIcon":"_bui-BadgeIcon_an6rw_55"},y=x()({styles:j,classNames:{root:"bui-Badge",icon:"bui-BadgeIcon"},bg:"consumer",propDefs:{icon:{},size:{dataAttribute:!0,default:"small"},children:{},className:{}}}),a=f.forwardRef((i,l)=>{const{ownProps:p,restProps:u,dataAttributes:g}=h(y,i),{classes:o,children:B,icon:c}=p;return e.jsxs("span",{ref:l,className:o.root,...g,...u,children:[c&&e.jsx("span",{className:o.icon,children:c}),B]})});a.__docgenInfo={description:`A non-interactive badge for labeling or categorizing content.

@public`,methods:[],displayName:"Badge",props:{icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"The icon to display before the badge text."},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:"The size of the badge."},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const t=b.meta({title:"Backstage UI/Badge",component:a,decorators:[i=>e.jsx(z,{children:e.jsx(i,{})})]}),n=t.story({args:{children:"Banana"}}),s=t.story({render:()=>e.jsxs(m,{direction:"row",gap:"2",children:[e.jsx(a,{size:"small",children:"Banana"}),e.jsx(a,{size:"medium",children:"Banana"})]})}),r=t.story({render:()=>e.jsxs(m,{direction:"row",gap:"2",children:[e.jsx(a,{size:"small",icon:e.jsx(d,{}),children:"Banana"}),e.jsx(a,{size:"medium",icon:e.jsx(d,{}),children:"Banana"})]})});n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Banana'
  }
})`,...n.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="2">
      <Badge size="small">Banana</Badge>
      <Badge size="medium">Banana</Badge>
    </Flex>
})`,...s.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="2">
      <Badge size="small" icon={<RiBugLine />}>
        Banana
      </Badge>
      <Badge size="medium" icon={<RiBugLine />}>
        Banana
      </Badge>
    </Flex>
})`,...r.input.parameters?.docs?.source}}};const v=["Default","Sizes","WithIcon"];export{n as Default,s as Sizes,r as WithIcon,v as __namedExportsOrder};
