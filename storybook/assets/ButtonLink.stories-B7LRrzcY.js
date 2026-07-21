import{bg as R,ca as w,cH as T,bR as e,c7 as E,w as _}from"./iframe-DmKIhSd4.js";import{$ as F}from"./Link-D3Yf34lr.js";import{g as P}from"./getNodeText-CQ1DPIaE.js";import{T as r,F as y}from"./index-BPEgRMek.js";import{F as s}from"./Flex-Cr1JVcgP.js";import{B as C}from"./BUIProvider-8kFB0Ao9.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-Bp1UFdf_.js";import"./useObjectRef-DibnPYi9.js";import"./useLink-BEUc_BxG.js";import"./useFocusRing-DrLz8-Tu.js";import"./openLink-Zk6hhSyn.js";import"./usePress-DvOXzaHx.js";import"./textSelection-DOq0Tvnx.js";import"./useHover-CwSUiPfU.js";import"./useResolvedHref-XzxGpNLx.js";const D={"bui-ButtonLink":"_bui-ButtonLink_ek4wo_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_ek4wo_168"},z=R()({styles:D,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",analytics:!0,propDefs:{noTrack:{},size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{}}}),t=w.forwardRef((n,k)=>{const{ownProps:B,restProps:i,dataAttributes:h,analytics:v}=T(z,n),{classes:x,iconStart:L,iconEnd:S,children:g}=B,j=b=>{i.onPress?.(b);const f=i["aria-label"]??P(g)??String(i.href??"");v.captureEvent("click",f,{attributes:{to:String(i.href??"")}})};return e.jsx(F,{className:x.root,ref:k,...h,...i,onPress:j,children:e.jsxs("span",{className:x.content,children:[L,g,S]})})});t.displayName="ButtonLink";t.__docgenInfo={description:`A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.

@public`,methods:[],displayName:"ButtonLink",props:{noTrack:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const a=E.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[n=>e.jsx(_,{children:e.jsx(C,{children:e.jsx(n,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),o=a.story({args:{children:"Button"}}),l=a.story({render:()=>e.jsxs(s,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),c=a.story({args:{children:"Button"},render:()=>e.jsxs(s,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(r,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(r,{}),children:"Medium"})]})}),u=a.story({args:{children:"Button"},render:n=>e.jsxs(s,{align:"center",children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(y,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(y,{})})]})}),m=a.story({args:{children:"Button"},render:n=>e.jsxs(s,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(y,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(y,{})})]})}),d=a.story({render:()=>e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),p=a.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...o.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};const Y=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{o as Default,d as Disabled,m as FullWidth,p as Responsive,c as Sizes,l as Variants,u as WithIcons,Y as __namedExportsOrder};
