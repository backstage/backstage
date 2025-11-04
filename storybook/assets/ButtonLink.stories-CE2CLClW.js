import{r as F,j as e}from"./iframe-BFEEYdl1.js";import{c as S}from"./clsx-B-dksMZM.js";import{$ as R}from"./Link-DBJ2L0jB.js";import{u as f}from"./useStyles-DEoPrLs_.js";import{i as z}from"./isExternalLink-DzQTpl4p.js";import{s as b}from"./Button.module-BHYJStbY.js";import{c as D,d as N,M as P}from"./index-DFzOTOJF.js";import{$ as T}from"./usePress-CTqDMXGL.js";import{T as t,r as p}from"./index-BC3lOP_B.js";import{F as n}from"./Flex-D_SmNuW4.js";import"./preload-helper-D9Z9MdNV.js";import"./utils-DBQRPUCK.js";import"./useFocusRing-5Bv8HprM.js";const r=F.forwardRef((a,y)=>{const w=D(),{classNames:i,dataAttributes:g,cleanedProps:E}=f("Button",{size:"small",variant:"primary",...a}),{classNames:h}=f("ButtonLink"),{children:B,className:k,iconStart:v,iconEnd:L,href:x,...j}=E;return z(x)?e.jsxs(R,{className:S(i.root,h.root,b[i.root],k),ref:y,...g,href:x,...j,children:[v,B,L]}):e.jsx(T,{navigate:w,useHref:N,children:e.jsxs(R,{className:S(i.root,h.root,b[i.root],k),ref:y,...g,href:x,...j,children:[v,B,L]})})});r.displayName="ButtonLink";r.__docgenInfo={description:"@public",methods:[],displayName:"ButtonLink",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:`| 'primary'
| 'secondary'
| 'tertiary'
| Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>`,elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>"}],raw:"Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["RALinkProps"]};const K={title:"Backstage UI/ButtonLink",component:r,decorators:[a=>e.jsx(P,{children:e.jsx(a,{})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},s={args:{children:"Button"}},o={render:()=>e.jsxs(n,{align:"center",children:[e.jsx(r,{iconStart:e.jsx(t,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(r,{iconStart:e.jsx(t,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(r,{iconStart:e.jsx(t,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})},l={args:{children:"Button"},render:()=>e.jsxs(n,{align:"center",children:[e.jsx(r,{size:"small",iconStart:e.jsx(t,{}),children:"Small"}),e.jsx(r,{size:"medium",iconStart:e.jsx(t,{}),children:"Medium"})]})},c={args:{children:"Button"},render:a=>e.jsxs(n,{align:"center",children:[e.jsx(r,{...a,iconStart:e.jsx(t,{})}),e.jsx(r,{...a,iconEnd:e.jsx(p,{})}),e.jsx(r,{...a,iconStart:e.jsx(t,{}),iconEnd:e.jsx(p,{})})]})},m={args:{children:"Button"},render:a=>e.jsxs(n,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(r,{...a,iconStart:e.jsx(t,{})}),e.jsx(r,{...a,iconEnd:e.jsx(p,{})}),e.jsx(r,{...a,iconStart:e.jsx(t,{}),iconEnd:e.jsx(p,{})})]})},d={render:()=>e.jsxs(n,{direction:"row",gap:"4",children:[e.jsx(r,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(r,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(r,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},u={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};const Q=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{s as Default,d as Disabled,m as FullWidth,u as Responsive,l as Sizes,o as Variants,c as WithIcons,Q as __namedExportsOrder,K as default};
