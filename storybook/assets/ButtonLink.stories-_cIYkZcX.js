import{ca as R,T as w,bg as T,cH as P,bR as e,c7 as E,w as D}from"./iframe-DogXi1kP.js";import{a as C,e as F,b as _}from"./utils-AxfqVSE9.js";import{$ as z}from"./useLink-C5PjbgXa.js";import{a as N,m as A}from"./useFocusRing-mENG_ikp.js";import{e as q}from"./useObjectRef-UHrM_yCs.js";import{$ as I}from"./useHover-ox9S2Piy.js";import{g as M}from"./getNodeText-8Y9Za0Fs.js";import{T as r,F as L}from"./index-RV6Ph9vd.js";import{F as l}from"./Flex-Bi-SKTgz.js";import{B as W}from"./BUIProvider-coEk1xkK.js";import"./preload-helper-PPVm8Dsz.js";import"./openLink-CxuZpafj.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useResolvedHref-BFQ7w248.js";const O=R.createContext(null),V=R.forwardRef(function(a,o){[a,o]=C(a,o,O);let i=a.href&&!a.isDisabled?"a":"span",{linkProps:S,isPressed:c}=z({...a,elementType:i},o),d=F[i],{hoverProps:j,isHovered:u}=I(a),{focusProps:m,isFocused:p,isFocusVisible:x}=N(),f=_({...a,defaultClassName:"react-aria-Link",values:{isCurrent:!!a["aria-current"],isDisabled:a.isDisabled||!1,isPressed:c,isHovered:u,isFocused:p,isFocusVisible:x}}),$=A(a,{global:!0});return delete $.onClick,w.createElement(d,{ref:o,slot:a.slot||void 0,...q($,f,S,j,m),"data-focused":p||void 0,"data-hovered":u||void 0,"data-pressed":c||void 0,"data-focus-visible":x||void 0,"data-current":!!a["aria-current"]||void 0,"data-disabled":a.isDisabled||void 0},f.children)}),H={"bui-ButtonLink":"_bui-ButtonLink_ek4wo_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_ek4wo_168"},U=T()({styles:H,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",analytics:!0,propDefs:{noTrack:{},size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{}}}),t=R.forwardRef((n,a)=>{const{ownProps:o,restProps:i,dataAttributes:S,analytics:c}=P(U,n),{classes:d,iconStart:j,iconEnd:u,children:m}=o,p=x=>{i.onPress?.(x);const f=i["aria-label"]??M(m)??String(i.href??"");c.captureEvent("click",f,{attributes:{to:String(i.href??"")}})};return e.jsx(V,{className:d.root,ref:a,...S,...i,onPress:p,children:e.jsxs("span",{className:d.content,children:[j,m,u]})})});t.displayName="ButtonLink";t.__docgenInfo={description:`A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.

@public`,methods:[],displayName:"ButtonLink",props:{noTrack:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const s=E.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[n=>e.jsx(D,{children:e.jsx(W,{children:e.jsx(n,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),y=s.story({args:{children:"Button"}}),g=s.story({render:()=>e.jsxs(l,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),k=s.story({args:{children:"Button"},render:()=>e.jsxs(l,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(r,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(r,{}),children:"Medium"})]})}),h=s.story({args:{children:"Button"},render:n=>e.jsxs(l,{align:"center",children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(L,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(L,{})})]})}),v=s.story({args:{children:"Button"},render:n=>e.jsxs(l,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(L,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(L,{})})]})}),B=s.story({render:()=>e.jsxs(l,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),b=s.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...y.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...b.input.parameters?.docs?.source}}};const le=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{y as Default,B as Disabled,v as FullWidth,b as Responsive,k as Sizes,g as Variants,h as WithIcons,le as __namedExportsOrder};
