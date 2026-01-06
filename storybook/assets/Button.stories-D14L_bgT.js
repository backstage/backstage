import{a3 as S,j as n,r as v}from"./iframe-DgkzaRcz.js";import{B as t}from"./Button-De1qsbfv.js";import{T as i,r as s}from"./index-Dr2gkvOD.js";import{F as e}from"./Flex-B8qpB4By.js";import{T as d}from"./Text-DJpFgIDa.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./Button-Dxt_JtTg.js";import"./utils-DXdUakEl.js";import"./useObjectRef-DdJCRQmh.js";import"./Label-CC5zQ6hO.js";import"./Hidden-CuH5BjYK.js";import"./useFocusable-Bs2V2rS4.js";import"./useLabel-BeqnMw1G.js";import"./useLabels-C9J2TuTi.js";import"./context-CuzNOC1H.js";import"./usePress-D8Rxhpsk.js";import"./useFocusRing-BrGlfS6q.js";import"./useStyles-CbKXL5Hp.js";import"./Button.module-BPzqtDAO.js";const o=S.meta({title:"Backstage UI/Button",component:t,argTypes:{size:{control:"select",options:["small","medium"]},variant:{control:"select",options:["primary","secondary"]}}}),l=o.story({args:{children:"Button"}}),c=o.story({args:{children:"Button"},parameters:{argTypes:{variant:{control:!1}}},render:()=>n.jsxs(e,{align:"center",children:[n.jsx(t,{iconStart:n.jsx(i,{}),variant:"primary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:"secondary",children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:"tertiary",children:"Button"})]})}),u=o.story({args:{children:"Button"},render:()=>n.jsxs(e,{align:"center",children:[n.jsx(t,{size:"small",iconStart:n.jsx(i,{}),children:"Small"}),n.jsx(t,{size:"medium",iconStart:n.jsx(i,{}),children:"Medium"})]})}),m=o.story({args:{children:"Button"},render:r=>n.jsxs(e,{align:"center",children:[n.jsx(t,{...r,iconStart:n.jsx(i,{})}),n.jsx(t,{...r,iconEnd:n.jsx(s,{})}),n.jsx(t,{...r,iconStart:n.jsx(i,{}),iconEnd:n.jsx(s,{})})]})}),p=o.story({args:{children:"Button"},render:r=>n.jsxs(e,{direction:"column",gap:"4",style:{width:"300px"},children:[n.jsx(t,{...r,iconStart:n.jsx(i,{})}),n.jsx(t,{...r,iconEnd:n.jsx(s,{})}),n.jsx(t,{...r,iconStart:n.jsx(i,{}),iconEnd:n.jsx(s,{})})]})}),x=o.story({render:()=>n.jsxs(e,{direction:"row",gap:"4",children:[n.jsx(t,{variant:"primary",isDisabled:!0,children:"Primary"}),n.jsx(t,{variant:"secondary",isDisabled:!0,children:"Secondary"}),n.jsx(t,{variant:"tertiary",isDisabled:!0,children:"Tertiary"})]})}),g=o.story({args:{children:"Button",variant:{initial:"primary",sm:"secondary"},size:{xs:"small",sm:"medium"}}}),L=["primary","secondary"],z=["small","medium"],B=o.story({args:{children:"Button"},render:()=>n.jsx(e,{direction:"column",children:L.map(r=>n.jsxs(e,{direction:"column",children:[n.jsx(d,{children:r}),z.map(a=>n.jsxs(e,{align:"center",children:[n.jsx(t,{variant:r,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:r,size:a,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(s,{}),variant:r,size:a,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),iconEnd:n.jsx(s,{}),style:{width:"200px"},variant:r,size:a,children:"Button"}),n.jsx(t,{variant:r,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconStart:n.jsx(i,{}),variant:r,size:a,isDisabled:!0,children:"Button"}),n.jsx(t,{iconEnd:n.jsx(s,{}),variant:r,size:a,isDisabled:!0,children:"Button"})]},a))]},r))})}),y=o.story({render:()=>{const[r,a]=v.useState(!1),j=()=>{a(!0),setTimeout(()=>{a(!1)},3e3)};return n.jsx(t,{variant:"primary",loading:r,onPress:j,children:"Load more items"})}}),h=o.story({render:()=>n.jsxs(e,{direction:"column",gap:"4",children:[n.jsx(d,{children:"Primary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"primary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"primary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(d,{children:"Secondary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"secondary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"secondary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"secondary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(d,{children:"Tertiary"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"tertiary",size:"small",loading:!0,children:"Small Loading"}),n.jsx(t,{variant:"tertiary",size:"medium",loading:!0,children:"Medium Loading"}),n.jsx(t,{variant:"tertiary",loading:!0,iconStart:n.jsx(i,{}),children:"With Icon"})]}),n.jsx(d,{children:"Loading vs Disabled"}),n.jsxs(e,{align:"center",gap:"4",children:[n.jsx(t,{variant:"primary",loading:!0,children:"Loading"}),n.jsx(t,{variant:"primary",isDisabled:!0,children:"Disabled"}),n.jsx(t,{variant:"primary",loading:!0,isDisabled:!0,children:"Both (Disabled Wins)"})]})]})});l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  }
})`,...l.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Button'
  },
  render: args => <Flex align="center">
      <Button {...args} iconStart={<RiCloudLine />} />
      <Button {...args} iconEnd={<RiArrowRightSLine />} />
      <Button {...args} iconStart={<RiCloudLine />} iconEnd={<RiArrowRightSLine />} />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};const G=["Default","Variants","Sizes","WithIcons","FullWidth","Disabled","Responsive","Playground","Loading","LoadingVariants"];export{l as Default,x as Disabled,p as FullWidth,y as Loading,h as LoadingVariants,B as Playground,g as Responsive,u as Sizes,c as Variants,m as WithIcons,G as __namedExportsOrder};
