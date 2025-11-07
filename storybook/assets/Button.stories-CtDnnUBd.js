import{j as t}from"./iframe-DGs96NRX.js";import{B as r}from"./Button-BZseCkD1.js";import{T as e,r as o}from"./index-Bt17eeEA.js";import{F as a}from"./Flex-DyTWKPeC.js";import{T as B}from"./Text-C6JGprs_.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./Button-BKPfLOkq.js";import"./utils-Cg2mtjSe.js";import"./Hidden-C43Hqw5G.js";import"./useFocusRing-BH5dx5ew.js";import"./usePress-CJ8kZKIo.js";import"./useStyles-DSKvYoj-.js";import"./Button.module-BHYJStbY.js";const f={title:"Backstage UI/Button",component:r,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},s={args:{children:"Button"}},c={args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>t.jsxs(a,{align:"center",children:[t.jsx(r,{iconStart:t.jsx(e,{}),variant:"primary",children:"Button"}),t.jsx(r,{iconStart:t.jsx(e,{}),variant:"secondary",children:"Button"}),t.jsx(r,{iconStart:t.jsx(e,{}),variant:"tertiary",children:"Button"})]})},d={args:{children:"Button"},render:()=>t.jsxs(a,{align:"center",children:[t.jsx(r,{size:"small",iconStart:t.jsx(e,{}),children:"Small"}),t.jsx(r,{size:"medium",iconStart:t.jsx(e,{}),children:"Medium"})]})},l={args:{children:"Button"},render:n=>t.jsxs(a,{align:"center",children:[t.jsx(r,{...n,iconStart:t.jsx(e,{})}),t.jsx(r,{...n,iconEnd:t.jsx(o,{})}),t.jsx(r,{...n,iconStart:t.jsx(e,{}),iconEnd:t.jsx(o,{})})]})},u={args:{children:"Button"},render:n=>t.jsxs(a,{direction:"column",gap:"4",style:{width:"300px"},children:[t.jsx(r,{...n,iconStart:t.jsx(e,{})}),t.jsx(r,{...n,iconEnd:t.jsx(o,{})}),t.jsx(r,{...n,iconStart:t.jsx(e,{}),iconEnd:t.jsx(o,{})})]})},m={render:()=>t.jsxs(a,{direction:"row",gap:"4",children:[t.jsx(r,{variant:"primary",isDisabled:!0,children:"Primary"}),t.jsx(r,{variant:"secondary",isDisabled:!0,children:"Secondary"}),t.jsx(r,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},p={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}},h=["primary","secondary"],g=["small","medium"],x={args:{children:"Button"},render:()=>t.jsx(a,{direction:"column",children:h.map(n=>t.jsxs(a,{direction:"column",children:[t.jsx(B,{children:n}),g.map(i=>t.jsxs(a,{align:"center",children:[t.jsx(r,{variant:n,size:i,children:"Button"}),t.jsx(r,{iconStart:t.jsx(e,{}),variant:n,size:i,children:"Button"}),t.jsx(r,{iconEnd:t.jsx(o,{}),variant:n,size:i,children:"Button"}),t.jsx(r,{iconStart:t.jsx(e,{}),iconEnd:t.jsx(o,{}),style:{width:"200px"},variant:n,size:i,children:"Button"}),t.jsx(r,{variant:n,size:i,isDisabled:!0,children:"Button"}),t.jsx(r,{iconStart:t.jsx(e,{}),variant:n,size:i,isDisabled:!0,children:"Button"}),t.jsx(r,{iconEnd:t.jsx(o,{}),variant:n,size:i,isDisabled:!0,children:"Button"})]},i))]},n))})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  parameters: {
    argTypes: {
      variant: {
        control: false
      }
    }
  },
  render: () => <Flex align="center">
      <Button iconStart={<RiCloudLine />} variant="primary">
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="secondary">
        Button
      </Button>
      <Button iconStart={<RiCloudLine />} variant="tertiary">
        Button
      </Button>
    </Flex>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <Button size="small" iconStart={<RiCloudLine />}>
        Small
      </Button>
      <Button size="medium" iconStart={<RiCloudLine />}>
        Medium
      </Button>
    </Flex>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="row" gap="4">
      <Button variant="primary" isDisabled>
        Primary
      </Button>
      <Button variant="secondary" isDisabled>
        Secondary
      </Button>
      <Button variant="tertiary" isDisabled>
        Tertiary
      </Button>
    </Flex>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex direction="column">
      {variants.map(variant => <Flex direction="column" key={variant}>
          <Text>{variant}</Text>
          {sizes.map(size => <Flex align="center" key={size}>
              <Button variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<RiCloudLine />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconEnd={<RiArrowRightSLine />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} style={{
          width: '200px'
        }} variant={variant} size={size}>
                Button
              </Button>
              <Button variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconStart={<RiCloudLine />} variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconEnd={<RiArrowRightSLine />} variant={variant} size={size} isDisabled>
                Button
              </Button>
            </Flex>)}
        </Flex>)}
    </Flex>
}`,...x.parameters?.docs?.source}}};const A=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground"];export{s as Default,m as Disabled,u as FullWidth,x as Playground,p as Responsive,d as Sizes,c as Variants,l as WithIcons,A as __namedExportsOrder,f as default};
