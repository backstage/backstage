import{j as n,r as y}from"./iframe-B6vHPHUS.js";import{B as t}from"./Button-CL-yh1kq.js";import{T as i,r as o}from"./index-CX60uPmW.js";import{F as e}from"./Flex-CUF93du8.js";import{T as s}from"./Text-B-LjbfPX.js";import"./preload-helper-D9Z9MdNV.js";import"./clsx-B-dksMZM.js";import"./Button-Bk6CObpo.js";import"./utils-Dc-c3eC3.js";import"./Label-Bwu2jGwM.js";import"./Hidden-ByRJzAKI.js";import"./useFocusRing-BPooT00c.js";import"./useLabel-BjKVVapu.js";import"./useLabels-CTSau9A7.js";import"./context-DsQFltCn.js";import"./usePress-D5zWsAX_.js";import"./useStyles-C-y3xpyB.js";import"./Button.module-BPzqtDAO.js";const _={title:"Backstage UI/Button",component:t,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}},d={args:{children:"Button"}},l={args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>n.jsxs(e,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(i,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:"tertiary",children:"Button"})]})},c={args:{children:"Button"},render:()=>n.jsxs(e,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(i,{}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(i,{}),children:"Medium"})]})},u={args:{children:"Button"},render:r=>n.jsxs(e,{align:"center",children:[n.jsx(t,{...r,iconStart:n.jsx(i,{})}),n.jsx(t,{...r,iconEnd:n.jsx(o,{})}),n.jsx(t,{...r,iconStart:n.jsx(i,{}),iconEnd:n.jsx(o,{})})]})},m={args:{children:"Button"},render:r=>n.jsxs(e,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...r,iconStart:n.jsx(i,{})}),n.jsx(t,{...r,iconEnd:n.jsx(o,{})}),n.jsx(t,{...r,iconStart:n.jsx(i,{}),iconEnd:n.jsx(o,{})})]})},x={render:()=>n.jsxs(e,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})},g={args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}},S=["primary","secondary"],v=["small","medium"],p={args:{children:"Button"},render:()=>n.jsx(e,{direction:"column",children:S.map(r=>n.jsxs(e,{direction:"column",children:[n.jsx(s,{children:r}),v.map(a=>n.jsxs(e,{align:"center",children:[n.jsx(t,{variant:r,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:r,size:a,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(o,{}),variant:r,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),iconEnd:n.jsx(o,{}),style:{width:"200px"},variant:r,size:a,children:"Button"}),n.jsx(t,{variant:r,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:r,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(o,{}),variant:r,size:a,isDisabled:!0,children:"Button"})]},a))]},r))})},B={render:()=>{const[r,a]=y.useState(!1),j=()=>{a(!0),setTimeout(()=>{a(!1)},3e3)};return n.jsx(t,{variant:"primary",loading:r,onPress:j,children:"Load more items"})}},h={render:()=>n.jsxs(e,{direction:"column",gap:"4",children:[n.jsx(s,{children:"Primary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"primary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"primary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(s,{children:"Secondary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"secondary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"secondary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"secondary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(s,{children:"Tertiary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"tertiary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"tertiary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"tertiary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(s,{children:"Loading vs Disabled"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",loading:!0,children:"Loading"}),n.jsx(t,{variant:"primary",isDisabled:!0,children:"Disabled"}),n.jsx(t,{variant:"primary",loading:!0,isDisabled:!0,children:"Both (Disabled Wins)"})]})]})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    };
    return <Button variant="primary" loading={isLoading} onPress={handleClick}>
        Load more items
      </Button>;
  }
}`,...B.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Flex direction="column" gap="4">
      <Text>Primary</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="primary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="primary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Secondary</Text>
      <Flex align="center" gap="4">
        <Button variant="secondary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="secondary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="secondary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Tertiary</Text>
      <Flex align="center" gap="4">
        <Button variant="tertiary" size="small" loading>
          Small Loading
        </Button>
        <Button variant="tertiary" size="medium" loading>
          Medium Loading
        </Button>
        <Button variant="tertiary" loading iconStart={<RiCloudLine />}>
          With Icon
        </Button>
      </Flex>

      <Text>Loading vs Disabled</Text>
      <Flex align="center" gap="4">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" isDisabled>
          Disabled
        </Button>
        <Button variant="primary" loading isDisabled>
          Both (Disabled Wins)
        </Button>
      </Flex>
    </Flex>
}`,...h.parameters?.docs?.source}}};const O=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground","Loading","LoadingVariants"];export{d as Default,x as Disabled,m as FullWidth,B as Loading,h as LoadingVariants,p as Playground,g as Responsive,c as Sizes,l as Variants,u as WithIcons,O as __namedExportsOrder,_ as default};
