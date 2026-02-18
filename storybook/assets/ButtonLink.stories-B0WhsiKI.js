import{r as v,j as n,p as R}from"./iframe-BCnUaApn.js";import{$ as b}from"./Link-CiGhsr8B.js";import{d as f,u as j}from"./defineComponent-DM3UJ0KB.js";import{I as w}from"./InternalLinkProvider-hZrGwUhP.js";import{T as r,r as p}from"./index-Cizx8GJy.js";import{M as F}from"./index-B-tXUl4g.js";import{F as d}from"./Flex-C4_VXeUv.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-RvjmVahY.js";import"./useObjectRef-BR0woDLl.js";import"./clsx-B-dksMZM.js";import"./useFocusable-IBdaFBnD.js";import"./useLink-Bfl2ix2d.js";import"./usePress-CH3IhpRl.js";import"./useFocusRing-BOpkZtUv.js";import"./useStyles-C_N034HV.js";import"./useBg-CcTCGP9g.js";const C={"bui-ButtonLink":"_bui-ButtonLink_a9zbf_20","bui-ButtonLinkContent":"_bui-ButtonLinkContent_a9zbf_168"},T=f()({styles:C,classNames:{root:"bui-ButtonLink",content:"bui-ButtonLinkContent"},bg:"consumer",propDefs:{size:{dataAttribute:!0,default:"small"},variant:{dataAttribute:!0,default:"primary"},iconStart:{},iconEnd:{},children:{},className:{},style:{}}}),t=v.forwardRef((e,k)=>{const{ownProps:y,restProps:B,dataAttributes:x}=j(T,e),{classes:L,iconStart:g,iconEnd:h,children:S}=y;return n.jsx(w,{href:B.href,children:n.jsx(b,{className:L.root,ref:k,...x,...B,children:n.jsxs("span",{className:L.content,children:[g,S,h]})})})});t.displayName="ButtonLink";t.__docgenInfo={description:"@public",methods:[],displayName:"ButtonLink",props:{size:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:"T | Partial<Record<Breakpoint, T>>",elements:[{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, T>"}],raw:"Partial<Record<Breakpoint, T>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"CSSProperties"},description:""}},composes:["Omit"]};const m=R.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[e=>n.jsx(F,{children:n.jsx(e,{})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),i=m.story({args:{children:"Button"}}),a=m.story({render:()=>n.jsxs(d,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),o=m.story({args:{children:"Button"},render:()=>n.jsxs(d,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(r,{}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(r,{}),children:"Medium"})]})}),s=m.story({args:{children:"Button"},render:e=>n.jsxs(d,{align:"center",children:[n.jsx(t,{...e,iconStart:n.jsx(r,{})}),n.jsx(t,{...e,iconEnd:n.jsx(p,{})}),n.jsx(t,{...e,iconStart:n.jsx(r,{}),iconEnd:n.jsx(p,{})})]})}),u=m.story({args:{children:"Button"},render:e=>n.jsxs(d,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...e,iconStart:n.jsx(r,{})}),n.jsx(t,{...e,iconEnd:n.jsx(p,{})}),n.jsx(t,{...e,iconStart:n.jsx(r,{}),iconEnd:n.jsx(p,{})})]})}),l=m.story({render:()=>n.jsxs(d,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),c=m.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Default = () => <ButtonLink>Button</ButtonLink>;
`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Variants = () => (
  <Flex align="center">
    <ButtonLink
      iconStart={<RiCloudLine />}
      variant="primary"
      href="https://ui.backstage.io"
      target="_blank"
    >
      Button
    </ButtonLink>
    <ButtonLink
      iconStart={<RiCloudLine />}
      variant="secondary"
      href="https://ui.backstage.io"
      target="_blank"
    >
      Button
    </ButtonLink>
    <ButtonLink
      iconStart={<RiCloudLine />}
      variant="tertiary"
      href="https://ui.backstage.io"
      target="_blank"
    >
      Button
    </ButtonLink>
  </Flex>
);
`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex align="center">
    <ButtonLink size="small" iconStart={<RiCloudLine />}>
      Small
    </ButtonLink>
    <ButtonLink size="medium" iconStart={<RiCloudLine />}>
      Medium
    </ButtonLink>
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const WithIcons = () => (
  <Flex align="center">
    <ButtonLink iconStart={<RiCloudLine />}>Button</ButtonLink>
    <ButtonLink iconEnd={<RiArrowRightSLine />}>Button</ButtonLink>
    <ButtonLink iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </ButtonLink>
  </Flex>
);
`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const FullWidth = () => (
  <Flex direction="column" gap="4" style={{ width: "300px" }}>
    <ButtonLink iconStart={<RiCloudLine />}>Button</ButtonLink>
    <ButtonLink iconEnd={<RiArrowRightSLine />}>Button</ButtonLink>
    <ButtonLink iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </ButtonLink>
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const Disabled = () => (
  <Flex direction="row" gap="4">
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
);
`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Responsive = () => (
  <ButtonLink
    variant={{
      initial: "primary",
      sm: "secondary",
    }}
    size={{
      xs: "small",
      sm: "medium",
    }}
  >
    Button
  </ButtonLink>
);
`,...c.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...s.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};const J=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{i as Default,l as Disabled,u as FullWidth,c as Responsive,o as Sizes,a as Variants,s as WithIcons,J as __namedExportsOrder};
