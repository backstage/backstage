import{j as n}from"./iframe-QBX5Mcuo.js";import{B as r}from"./Button-BOiu8nu2.js";import{F as a}from"./Flex-C_zNTqte.js";import{T as x}from"./Text-iP3QTJUz.js";import{I as t}from"./provider-CQEWCA66.js";import{T as B,a as g}from"./Tooltip-CmWxY4ni.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./Button-BF_FS8m8.js";import"./utils-DFUhmvA3.js";import"./Hidden-DDGo5K2I.js";import"./useFocusRing-NTOt2LXg.js";import"./usePress-Btrrxc0E.js";import"./useStyles-DcGRXPpD.js";import"./spacing.props-m9PQeFPu.js";import"./OverlayArrow-Cq-0HasV.js";import"./context-Dxx6ZTEA.js";import"./useControlledState-CtIhnGEo.js";const O={title:"Backstage UI/Button",component:r,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},i={args:{children:"Button"}},s={args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>n.jsxs(a,{align:"center",children:[n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),variant:"primary",children:"Button"}),n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),variant:"secondary",children:"Button"}),n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),variant:"tertiary",children:"Button"})]})},c={args:{children:"Button"},render:()=>n.jsxs(a,{align:"center",children:[n.jsx(r,{size:"small",iconStart:n.jsx(t,{name:"cloud"}),children:"Small"}),n.jsx(r,{size:"medium",iconStart:n.jsx(t,{name:"cloud"}),children:"Medium"})]})},d={args:{children:"Button"},render:e=>n.jsxs(a,{align:"center",children:[n.jsx(r,{...e,iconStart:n.jsx(t,{name:"cloud"})}),n.jsx(r,{...e,iconEnd:n.jsx(t,{name:"chevron-right"})}),n.jsx(r,{...e,iconStart:n.jsx(t,{name:"cloud"}),iconEnd:n.jsx(t,{name:"chevron-right"})})]})},l={args:{children:"Button"},render:e=>n.jsxs(a,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(r,{...e,iconStart:n.jsx(t,{name:"cloud"})}),n.jsx(r,{...e,iconEnd:n.jsx(t,{name:"chevron-right"})}),n.jsx(r,{...e,iconStart:n.jsx(t,{name:"cloud"}),iconEnd:n.jsx(t,{name:"chevron-right"})})]})},u={render:()=>n.jsxs(a,{direction:"row",gap:"4",children:[n.jsx(r,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(r,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(r,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},m={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}},j=["primary","secondary"],v=["small","medium"],p={args:{children:"Button"},render:()=>n.jsx(a,{direction:"column",children:j.map(e=>n.jsxs(a,{direction:"column",children:[n.jsx(x,{children:e}),v.map(o=>n.jsxs(a,{align:"center",children:[n.jsx(r,{variant:e,size:o,children:"Button"}),n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),variant:e,size:o,children:"Button"}),n.jsx(r,{iconEnd:n.jsx(t,{name:"chevron-right"}),variant:e,size:o,children:"Button"}),n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),iconEnd:n.jsx(t,{name:"chevron-right"}),style:{width:"200px"},variant:e,size:o,children:"Button"}),n.jsx(r,{variant:e,size:o,isDisabled:!0,children:"Button"}),n.jsx(r,{iconStart:n.jsx(t,{name:"cloud"}),variant:e,size:o,isDisabled:!0,children:"Button"}),n.jsx(r,{iconEnd:n.jsx(t,{name:"chevron-right"}),variant:e,size:o,isDisabled:!0,children:"Button"})]},o))]},e))})},h={render:()=>n.jsxs(B,{children:[n.jsx(r,{isDisabled:!0,children:"Save"}),n.jsx(g,{children:"Why this is disabled"})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
      <Button iconStart={<Icon name="cloud" />} variant="primary">
        Button
      </Button>
      <Button iconStart={<Icon name="cloud" />} variant="secondary">
        Button
      </Button>
      <Button iconStart={<Icon name="cloud" />} variant="tertiary">
        Button
      </Button>
    </Flex>
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: () => <Flex align="center">
      <Button size="small" iconStart={<Icon name="cloud" />}>
        Small
      </Button>
      <Button size="medium" iconStart={<Icon name="cloud" />}>
        Medium
      </Button>
    </Flex>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<Icon name="cloud" />} />
      <Button {...args} iconEnd={<Icon name="chevron-right" />} />
      <Button {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex direction="column" gap="4" style={{
    width: '300px'
  }}>
      <Button {...args} iconStart={<Icon name="cloud" />} />
      <Button {...args} iconEnd={<Icon name="chevron-right" />} />
      <Button {...args} iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} />
    </Flex>
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
              <Button iconStart={<Icon name="cloud" />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconEnd={<Icon name="chevron-right" />} variant={variant} size={size}>
                Button
              </Button>
              <Button iconStart={<Icon name="cloud" />} iconEnd={<Icon name="chevron-right" />} style={{
          width: '200px'
        }} variant={variant} size={size}>
                Button
              </Button>
              <Button variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconStart={<Icon name="cloud" />} variant={variant} size={size} isDisabled>
                Button
              </Button>
              <Button iconEnd={<Icon name="chevron-right" />} variant={variant} size={size} isDisabled>
                Button
              </Button>
            </Flex>)}
        </Flex>)}
    </Flex>
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <TooltipTrigger>
      <Button isDisabled>Save</Button>
      <Tooltip>Why this is disabled</Tooltip>
    </TooltipTrigger>
}`,...h.parameters?.docs?.source}}};const U=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground","DisabledWithTooltips"];export{i as Default,u as Disabled,h as DisabledWithTooltips,l as FullWidth,p as Playground,m as Responsive,c as Sizes,s as Variants,d as WithIcons,U as __namedExportsOrder,O as default};
