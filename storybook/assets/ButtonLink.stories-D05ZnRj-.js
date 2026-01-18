import{r as D,j as n,a5 as z}from"./iframe-Yl0Qc67S.js";import{c as y}from"./clsx-B-dksMZM.js";import{$ as _}from"./Link-BDzMB0E4.js";import{u as x}from"./useStyles-DTd0emH8.js";import{B as N,s as g}from"./Button.module-DkEJAzA0.js";import{i as P}from"./isExternalLink-DzQTpl4p.js";import{c as T,f as A,M as $}from"./index-CuRibKaG.js";import{d as W}from"./usePress-CFoQbYZv.js";import{T as r,r as B}from"./index-CT_LMPAP.js";import{F as d}from"./Flex-CNVottU6.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BeOnE2ty.js";import"./useObjectRef-B1bL3Spk.js";import"./useFocusable-wWhtWAm1.js";import"./useLink-CC2E5dm7.js";import"./useFocusRing-BU-o61Ng.js";import"./useSurface-9-qWkMCN.js";const q={classNames:{root:"bui-ButtonLink"}},t=D.forwardRef((e,h)=>{const S=T(),{classNames:p,dataAttributes:v,cleanedProps:R}=x(N,{size:"small",variant:"primary",...e}),{classNames:f}=x(q),{children:j,className:b,iconStart:w,iconEnd:F,href:k,...E}=R,C=P(k),L=n.jsx(_,{className:y(p.root,f.root,g[p.root],b),ref:h,...v,href:k,...E,children:n.jsxs("span",{className:y(p.content,g[p.content]),children:[w,j,F]})});return C?L:n.jsx(W,{navigate:S,useHref:A,children:L})});t.displayName="ButtonLink";t.__docgenInfo={description:"@public",methods:[],displayName:"ButtonLink",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:`| 'primary'
| 'secondary'
| 'tertiary'
| Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>`,elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>"}],raw:"Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["RALinkProps"]};const m=z.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[e=>n.jsx($,{children:n.jsx(e,{})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),i=m.story({args:{children:"Button"}}),a=m.story({render:()=>n.jsxs(d,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(r,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),n.jsx(t,{iconStart:n.jsx(r,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),o=m.story({args:{children:"Button"},render:()=>n.jsxs(d,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(r,{}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(r,{}),children:"Medium"})]})}),s=m.story({args:{children:"Button"},render:e=>n.jsxs(d,{align:"center",children:[n.jsx(t,{...e,iconStart:n.jsx(r,{})}),n.jsx(t,{...e,iconEnd:n.jsx(B,{})}),n.jsx(t,{...e,iconStart:n.jsx(r,{}),iconEnd:n.jsx(B,{})})]})}),l=m.story({args:{children:"Button"},render:e=>n.jsxs(d,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...e,iconStart:n.jsx(r,{})}),n.jsx(t,{...e,iconEnd:n.jsx(B,{})}),n.jsx(t,{...e,iconStart:n.jsx(r,{}),iconEnd:n.jsx(B,{})})]})}),u=m.story({render:()=>n.jsxs(d,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),c=m.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Default = () => <ButtonLink>Button</ButtonLink>;
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
`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const FullWidth = () => (
  <Flex direction="column" gap="4" style={{ width: "300px" }}>
    <ButtonLink iconStart={<RiCloudLine />}>Button</ButtonLink>
    <ButtonLink iconEnd={<RiArrowRightSLine />}>Button</ButtonLink>
    <ButtonLink iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />}>
      Button
    </ButtonLink>
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Disabled = () => (
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
`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Responsive = () => (
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
})`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};const an=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{i as Default,u as Disabled,l as FullWidth,c as Responsive,o as Sizes,a as Variants,s as WithIcons,an as __namedExportsOrder};
