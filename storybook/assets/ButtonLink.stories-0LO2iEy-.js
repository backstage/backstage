import{aD as R,r as w,aE as T,j as e,p as E}from"./iframe-C7lYm63e.js";import{T as P}from"./TestRouter-DYk_Fmku.js";import{$ as _}from"./Link-yEPv1lMU.js";import{g as D}from"./getNodeText-DRW1iLZn.js";import{B as F}from"./BUIRoutingProvider-BQOAZjhP.js";import{T as r,r as y}from"./index-YLMOL70x.js";import{F as s}from"./Flex-DrpRYDXu.js";import{B as C}from"./BUIProvider-uNuGl61A.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FJv8Tr6k.js";import"./utils-BUzKzuKz.js";import"./useObjectRef-aANnWHv4.js";import"./useLink-CvF7_JEa.js";import"./useFocusRing-DBYmBdNX.js";import"./usePress-DfP9K6Oc.js";import"./textSelection-DvQ0zR-N.js";import"./getMetaValue-C1Arjnva.js";import"./useHover-Dh_5CIee.js";const z={"bui-ButtonLink":"_bui-ButtonLink_1fr94_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_1fr94_169"},q=R()({styles:z,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",analytics:!0,propDefs:{noTrack:{},size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{}}});function N({definitionResult:n,forwardedRef:x}){const{ownProps:g,restProps:i,dataAttributes:k,analytics:f}=n,{classes:h,iconStart:v,iconEnd:L,children:B}=g,j=S=>{i.onPress?.(S);const b=i["aria-label"]??D(B)??String(i.href??"");f.captureEvent("click",b,{attributes:{to:String(i.href??"")}})};return e.jsx(_,{className:h.root,ref:x,...k,...i,onPress:j,children:e.jsxs("span",{className:h.content,children:[v,B,L]})})}const t=w.forwardRef((n,x)=>{const g=T(q,n);return e.jsx(F,{children:e.jsx(N,{definitionResult:g,forwardedRef:x})})});t.displayName="ButtonLink";t.__docgenInfo={description:`A button-styled anchor element for navigation, supporting optional start and end icon slots and analytics event tracking.

@public`,methods:[],displayName:"ButtonLink",props:{noTrack:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},routerOptions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** State associated with the destination history entry. */
  state?: unknown;
}`,signature:{properties:[{key:"replace",value:{name:"boolean",required:!1},description:"Replace the current history entry instead of adding one."},{key:"state",value:{name:"unknown",required:!1},description:"State associated with the destination history entry."}]}},description:"Options passed to the router configured on BUIProvider."}},composes:["Omit"]};const a=E.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[n=>e.jsx(P,{children:e.jsx(C,{children:e.jsx(n,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),o=a.story({args:{children:"Button"}}),l=a.story({render:()=>e.jsxs(s,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),c=a.story({args:{children:"Button"},render:()=>e.jsxs(s,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(r,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(r,{}),children:"Medium"})]})}),u=a.story({args:{children:"Button"},render:n=>e.jsxs(s,{align:"center",children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(y,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(y,{})})]})}),d=a.story({args:{children:"Button"},render:n=>e.jsxs(s,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...n,iconStart:e.jsx(r,{})}),e.jsx(t,{...n,iconEnd:e.jsx(y,{})}),e.jsx(t,{...n,iconStart:e.jsx(r,{}),iconEnd:e.jsx(y,{})})]})}),m=a.story({render:()=>e.jsxs(s,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),p=a.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};const ne=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{o as Default,m as Disabled,d as FullWidth,p as Responsive,c as Sizes,l as Variants,u as WithIcons,ne as __namedExportsOrder};
