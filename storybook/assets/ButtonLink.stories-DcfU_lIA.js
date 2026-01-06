import{r as z,j as e,a3 as N}from"./iframe-nUyzSU_S.js";import{c as B}from"./clsx-B-dksMZM.js";import{$ as P}from"./Link-DMYa2yD8.js";import{u as h}from"./useStyles-CGc-3N3i.js";import{B as T,s as k}from"./Button.module-BPzqtDAO.js";import{i as _}from"./isExternalLink-DzQTpl4p.js";import{c as C,f as $,M as A}from"./index-RHyzx4fN.js";import{d as q}from"./usePress-BH8p6QJN.js";import{T as n,r as y}from"./index-MzzIgoxX.js";import{F as i}from"./Flex-CfeLptgI.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-rSHFql8M.js";import"./useObjectRef-Bbtl2kU4.js";import"./useFocusable-biA5BNNR.js";import"./useLink-Dx0EdjAl.js";import"./useFocusRing-BgStHPdn.js";const I={classNames:{root:"bui-ButtonLink"}},t=z.forwardRef((r,v)=>{const L=C(),{classNames:s,dataAttributes:j,cleanedProps:S}=h(T,{size:"small",variant:"primary",...r}),{classNames:f}=h(I),{children:R,className:b,iconStart:w,iconEnd:E,href:x,...F}=S,D=_(x),g=e.jsx(P,{className:B(s.root,f.root,k[s.root],b),ref:v,...j,href:x,...F,children:e.jsxs("span",{className:B(s.content,k[s.content]),children:[w,R,E]})});return D?g:e.jsx(q,{navigate:L,useHref:$,children:g})});t.displayName="ButtonLink";t.__docgenInfo={description:"@public",methods:[],displayName:"ButtonLink",props:{size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium' | Partial<Record<Breakpoint, 'small' | 'medium'>>",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]}],raw:"Record<Breakpoint, 'small' | 'medium'>"}],raw:"Partial<Record<Breakpoint, 'small' | 'medium'>>"}]},description:""},variant:{required:!1,tsType:{name:"union",raw:`| 'primary'
| 'secondary'
| 'tertiary'
| Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>`,elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"},{name:"Partial",elements:[{name:"Record",elements:[{name:"union",raw:"'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'initial'"},{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},{name:"union",raw:"'primary' | 'secondary' | 'tertiary'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'tertiary'"}]}],raw:"Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>"}],raw:"Partial<Record<Breakpoint, 'primary' | 'secondary' | 'tertiary'>>"}]},description:""},iconStart:{required:!1,tsType:{name:"ReactElement"},description:""},iconEnd:{required:!1,tsType:{name:"ReactElement"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["RALinkProps"]};const a=N.meta({title:"Backstage UI/ButtonLink",component:t,decorators:[r=>e.jsx(A,{children:e.jsx(r,{})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),o=a.story({args:{children:"Button"}}),l=a.story({render:()=>e.jsxs(i,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(n,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(n,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),e.jsx(t,{iconStart:e.jsx(n,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),c=a.story({args:{children:"Button"},render:()=>e.jsxs(i,{align:"center",children:[e.jsx(t,{size:"small",iconStart:e.jsx(n,{}),children:"Small"}),e.jsx(t,{size:"medium",iconStart:e.jsx(n,{}),children:"Medium"})]})}),m=a.story({args:{children:"Button"},render:r=>e.jsxs(i,{align:"center",children:[e.jsx(t,{...r,iconStart:e.jsx(n,{})}),e.jsx(t,{...r,iconEnd:e.jsx(y,{})}),e.jsx(t,{...r,iconStart:e.jsx(n,{}),iconEnd:e.jsx(y,{})})]})}),u=a.story({args:{children:"Button"},render:r=>e.jsxs(i,{direction:"column",gap:"4",style:{width:"300px"},children:[e.jsx(t,{...r,iconStart:e.jsx(n,{})}),e.jsx(t,{...r,iconEnd:e.jsx(y,{})}),e.jsx(t,{...r,iconStart:e.jsx(n,{}),iconEnd:e.jsx(y,{})})]})}),d=a.story({render:()=>e.jsxs(i,{direction:"row",gap:"4",children:[e.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),e.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),e.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),p=a.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <ButtonLink {...args} iconStart={<RiCloudLine />} />
      <ButtonLink {...args} iconEnd={<RiArrowRightSLine />} />
      <ButtonLink {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};const ne=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{o as Default,d as Disabled,u as FullWidth,p as Responsive,c as Sizes,l as Variants,m as WithIcons,ne as __namedExportsOrder};
