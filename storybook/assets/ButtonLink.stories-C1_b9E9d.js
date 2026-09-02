import{be as T,c8 as E,cE as P,bQ as e,bv as _,c5 as F,w as D}from"./iframe-BiC6vzfc.js";import{$ as C}from"./Link-BxM_H5UN.js";import{g as z}from"./getNodeText-9xFtoTWr.js";import{T as r,F as x}from"./index-BGy42kW1.js";import{F as o}from"./Flex-wFSzcl10.js";import{B as A}from"./BUIProvider-DEMxJ951.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BQPJ15nW.js";import"./useObjectRef-rJAA83qf.js";import"./useLink-C_UAK_Mo.js";import"./useFocusRing-CYz7DZLf.js";import"./openLink-fglnGFM4.js";import"./usePress-Czxg5-q_.js";import"./textSelection-BLan3Cos.js";import"./useHover-CRtjWjkD.js";import"./BUIRoutingProvider-ht1fdH5F.js";import"./useResolvedHref-G7FW9UOs.js";const N={"bui-ButtonLink":"_bui-ButtonLink_106rl_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_106rl_169"},q=T()({styles:N,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",analytics:!0,navigation:{type:"anchor"},propDefs:{noTrack:{},size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{}}});function I({definitionResult:n,navigation:g,forwardedRef:s}){const{ownProps:h,restProps:a,dataAttributes:v,analytics:L}=n,{classes:B,iconStart:f,iconEnd:S,children:k}=h,b=a.isDisabled?{href:void 0,routerOptions:void 0,render:void 0}:_(g,a),j=R=>{a.onPress?.(R);const w=a["aria-label"]??z(k)??String(a.href??"");L.captureEvent("click",w,{attributes:{to:String(a.href??"")}})};return e.jsx(C,{className:B.root,ref:s,...v,...a,...b,onPress:j,children:e.jsxs("span",{className:B.content,children:[f,k,S]})})}const t=E.forwardRef((n,g)=>{const s=P(q,n),h=s.navigation;return e.jsx(h,{props:s.restProps,view:I,viewProps:{definitionResult:s,forwardedRef:g}})});t.displayName="ButtonLink";t.__docgenInfo={description:`A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.

@public`,methods:[],displayName:"ButtonLink",props:{noTrack:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const i=F.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[n=>e.jsx(D,{children:e.jsx(A,{children:e.jsx(n,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),l=i.story({args:{children:"Button"}}),c=i.story({render:()=>e.jsxs(o,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),u=i.story({args:{children:"Button"},render:()=>e.jsxs(o,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(r,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(r,{}),children:"Medium"})]})}),m=i.story({args:{children:"Button"},render:n=>e.jsxs(o,{align:"center",children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(x,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(x,{})})]})}),d=i.story({args:{children:"Button"},render:n=>e.jsxs(o,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(x,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(x,{})})]})}),p=i.story({render:()=>e.jsxs(o,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),y=i.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ButtonLink iconStart={<RiCloudLine />} variant="primary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
      <ButtonLink iconStart={<RiCloudLine />} variant="secondary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
      <ButtonLink iconStart={<RiCloudLine />} variant="tertiary" href="https://ui.backstage.io" target="_blank">
        Button
      </ButtonLink>
    </Flex>
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <ButtonLink size="small" iconStart={<RiCloudLine />}>
        Small
      </ButtonLink>
      <ButtonLink size="medium" iconStart={<RiCloudLine />}>
        Medium
      </ButtonLink>
    </Flex>
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="4">
      <ButtonLink variant="primary" isDisabled>
        Primary
      </ButtonLink>
      <ButtonLink variant="secondary" isDisabled>
        Secondary
      </ButtonLink>
      <ButtonLink variant="tertiary" isDisabled>
        Tertiary
      </ButtonLink>
    </Flex>
})`,...p.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button',
    variant: {
      initial: 'primary',
      sm: 'secondary'
    },
    size: {
      xs: 'small',
      sm: 'medium'
    }
  }
})`,...y.input.parameters?.docs?.source}}};const re=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{l as Default,p as Disabled,d as FullWidth,y as Responsive,u as Sizes,c as Variants,m as WithIcons,re as __namedExportsOrder};
