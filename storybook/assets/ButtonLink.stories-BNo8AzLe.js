import{r as R,R as w,aw as T,au as P,j as e,p as E,M as D}from"./iframe-KINrIo_f.js";import{$ as C,a as F,b as _}from"./utils-Dp48jrsX.js";import{b as z}from"./useObjectRef-Cl-GJEjw.js";import{a as N}from"./useFocusable-CaaSd55t.js";import{$ as A}from"./useLink-u3iPRNma.js";import{a as q,b as I}from"./useFocusRing-BZvEHQX6.js";import{g as M}from"./getNodeText-MPmDkoxK.js";import{T as r,r as L}from"./index-Dv1l67z5.js";import{F as l}from"./Flex-3FJaFP3S.js";import{B as W}from"./BUIProvider-Ciu3w9NY.js";import"./preload-helper-PPVm8Dsz.js";import"./openLink-BCV1Ju3v.js";import"./usePress-BRBPsLh-.js";import"./textSelection-1F9aHMh8.js";const O=R.createContext(null),V=R.forwardRef(function(n,o){[n,o]=C(n,o,O);let i=n.href&&!n.isDisabled?"a":"span",{linkProps:S,isPressed:c}=A({...n,elementType:i},o),d=F[i],{hoverProps:j,isHovered:u}=q(n),{focusProps:m,isFocused:p,isFocusVisible:x}=I(),y=_({...n,defaultClassName:"react-aria-Link",values:{isCurrent:!!n["aria-current"],isDisabled:n.isDisabled||!1,isPressed:c,isHovered:u,isFocused:p,isFocusVisible:x}}),$=N(n,{global:!0});return delete $.onClick,w.createElement(d,{ref:o,slot:n.slot||void 0,...z($,y,S,j,m),"data-focused":p||void 0,"data-hovered":u||void 0,"data-pressed":c||void 0,"data-focus-visible":x||void 0,"data-current":!!n["aria-current"]||void 0,"data-disabled":n.isDisabled||void 0},y.children)}),U={"bui-ButtonLink":"_bui-ButtonLink_ek4wo_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_ek4wo_168"},H=T()({styles:U,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",analytics:!0,propDefs:{noTrack:{},size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{}}}),t=R.forwardRef((a,n)=>{const{ownProps:o,restProps:i,dataAttributes:S,analytics:c}=P(H,a),{classes:d,iconStart:j,iconEnd:u,children:m}=o,p=x=>{i.onPress?.(x);const y=i["aria-label"]??M(m)??String(i.href??"");c.captureEvent("click",y,{attributes:{to:String(i.href??"")}})};return e.jsx(V,{className:d.root,ref:n,...S,...i,onPress:p,children:e.jsxs("span",{className:d.content,children:[j,m,u]})})});t.displayName="ButtonLink";t.__docgenInfo={description:`A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.

@public`,methods:[],displayName:"ButtonLink",props:{noTrack:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const s=E.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[a=>e.jsx(D,{children:e.jsx(W,{children:e.jsx(a,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),f=s.story({args:{children:"Button"}}),g=s.story({render:()=>e.jsxs(l,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),k=s.story({args:{children:"Button"},render:()=>e.jsxs(l,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(r,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(r,{}),children:"Medium"})]})}),h=s.story({args:{children:"Button"},render:a=>e.jsxs(l,{align:"center",children:[e.jsx(t,{...a,iconStart:e.jsx(r,{})}),e.jsx(t,{...a,iconEnd:e.jsx(L,{})}),e.jsx(t,{...a,iconStart:e.jsx(r,{}),iconEnd:e.jsx(L,{})})]})}),v=s.story({args:{children:"Button"},render:a=>e.jsxs(l,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...a,iconStart:e.jsx(r,{})}),e.jsx(t,{...a,iconEnd:e.jsx(L,{})}),e.jsx(t,{...a,iconStart:e.jsx(r,{}),iconEnd:e.jsx(L,{})})]})}),B=s.story({render:()=>e.jsxs(l,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),b=s.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...f.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...k.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};const oe=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{f as Default,B as Disabled,v as FullWidth,b as Responsive,k as Sizes,g as Variants,h as WithIcons,oe as __namedExportsOrder};
