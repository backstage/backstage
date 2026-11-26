import{j as t,p as x}from"./iframe-7sCYbwMA.js";import{T as g}from"./TestRouter-CIUVCPAh.js";import{B as r}from"./ButtonLink-C1T5qJbW.js";import{T as i,r as m}from"./index-DXJUlwCm.js";import{F as a}from"./Flex-CmyHw2X8.js";import{B as h}from"./BUIProvider-D7bQEjvA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CohR7ztA.js";import"./Link-DFonM9Xl.js";import"./utils-9GxVsiDp.js";import"./useObjectRef-B-PPvPC_.js";import"./useLink-C7y3xXYf.js";import"./useFocusRing-DtQAi71R.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./useHover-Bvne2y_8.js";import"./getNodeText-HaqtCM3s.js";import"./BUIRoutingProvider-DiU1oZiY.js";const e=x.meta({title:"Backstage UI/ButtonLink",component:r,decorators:[n=>t.jsx(g,{children:t.jsx(h,{children:t.jsx(n,{})})})],argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),s=e.story({args:{children:"Button"}}),o=e.story({render:()=>t.jsxs(a,{align:"center",children:[t.jsx(r,{iconStart:t.jsx(i,{}),variant:"primary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),t.jsx(r,{iconStart:t.jsx(i,{}),variant:"secondary",href:"https://ui.backstage.io",target:"_blank",children:"Button"}),t.jsx(r,{iconStart:t.jsx(i,{}),variant:"tertiary",href:"https://ui.backstage.io",target:"_blank",children:"Button"})]})}),c=e.story({args:{children:"Button"},render:()=>t.jsxs(a,{align:"center",children:[t.jsx(r,{size:"small",iconStart:t.jsx(i,{}),children:"Small"}),t.jsx(r,{size:"medium",iconStart:t.jsx(i,{}),children:"Medium"})]})}),u=e.story({args:{children:"Button"},render:n=>t.jsxs(a,{align:"center",children:[t.jsx(r,{...n,iconStart:t.jsx(i,{})}),t.jsx(r,{...n,iconEnd:t.jsx(m,{})}),t.jsx(r,{...n,iconStart:t.jsx(i,{}),iconEnd:t.jsx(m,{})})]})}),d=e.story({args:{children:"Button"},render:n=>t.jsxs(a,{direction:"column",gap:"4",style:{width:"300px"},children:[t.jsx(r,{...n,iconStart:t.jsx(i,{})}),t.jsx(r,{...n,iconEnd:t.jsx(m,{})}),t.jsx(r,{...n,iconStart:t.jsx(i,{}),iconEnd:t.jsx(m,{})})]})}),p=e.story({render:()=>t.jsxs(a,{direction:"row",gap:"4",children:[t.jsx(r,{variant:"primary",isDisabled:!0,children:"Primary"}),t.jsx(r,{variant:"secondary",isDisabled:!0,children:"Secondary"}),t.jsx(r,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),l=e.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...l.input.parameters?.docs?.source}}};const I=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive"];export{s as Default,p as Disabled,d as FullWidth,l as Responsive,c as Sizes,o as Variants,u as WithIcons,I as __namedExportsOrder};
