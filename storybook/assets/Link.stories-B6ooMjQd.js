import{p as m,j as t}from"./iframe-M9O-K8SB.js";import{L as e}from"./Link-DZChSlvh.js";import{M as k}from"./index-CuiKZooy.js";import{F as n}from"./Flex-Bz2InqMs.js";import{T as g}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-BRwt6BXn.js";import"./InternalLinkProvider-Bi_DmABW.js";import"./useFocusable-BwFERnd_.js";import"./useObjectRef-BPFp5snO.js";import"./useLink-B9gmuu0v.js";import"./usePress-ByOsZuB9.js";import"./useSurface-CJaN3YoD.js";const r=m.meta({title:"Backstage UI/Link",component:e,args:{children:"Link"},decorators:[a=>t.jsx(k,{children:t.jsx(a,{})})]}),i=r.story({args:{href:"/",children:"Sign up for Backstage"}}),s=r.story({args:{href:"https://backstage.io",children:"Sign up for Backstage",target:"_blank"}}),l=r.story({args:{...i.input.args},render:a=>t.jsxs(n,{gap:"4",direction:"column",children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-large",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-medium",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-x-small",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-large",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-medium",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-small",...a}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-x-small",...a})]})}),o=r.story({render:()=>t.jsxs(n,{gap:"4",direction:"column",children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"primary",children:"I am primary"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"secondary",children:"I am secondary"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"danger",children:"I am danger"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"warning",children:"I am warning"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"success",children:"I am success"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",color:"info",children:"I am info"})]})}),c=r.story({render:()=>t.jsxs(n,{gap:"4",direction:"column",children:[t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-large",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-large",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-medium",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-medium",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-small",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"title-x-small",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"title-x-small",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"body-large",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-large",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"body-medium",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-medium",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"body-small",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-small",weight:"bold",children:"A turtle"})]}),t.jsxs(n,{children:[t.jsx(e,{href:"https://ui.backstage.io",variant:"body-x-small",weight:"regular",children:"A fox"}),t.jsx(e,{href:"https://ui.backstage.io",variant:"body-x-small",weight:"bold",children:"A turtle"})]})]})}),h=r.story({args:{children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",href:"/",truncate:!0,style:{width:"480px"}}}),u=r.story({args:{href:"/",children:"Standalone link (no underline by default)",standalone:!0}}),d=r.story({render:()=>t.jsxs(n,{gap:"4",direction:"column",children:[t.jsx(g,{children:"Default link (underline by default):"}),t.jsx(e,{href:"/",children:"Sign up for Backstage"}),t.jsx(g,{children:"Standalone link (underline on hover only):"}),t.jsx(e,{href:"/",standalone:!0,children:"Sign up for Backstage"})]})}),p=r.story({args:{...i.input.args,variant:{xs:"title-x-small",md:"body-x-small"}}});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Default = () => <Link href="/">Sign up for Backstage</Link>;
`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const ExternalLink = () => (
  <Link href="https://backstage.io" target="_blank">
    Sign up for Backstage
  </Link>
);
`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const AllVariants = () => (
  <Flex gap="4" direction="column">
    <Link href="https://ui.backstage.io" variant="title-large">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="title-medium">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="title-small">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="title-x-small">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="body-large">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="body-medium">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="body-small">
      Link
    </Link>
    <Link href="https://ui.backstage.io" variant="body-x-small">
      Link
    </Link>
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const AllColors = () => (
  <Flex gap="4" direction="column">
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="primary"
      children="I am primary"
    />
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="secondary"
      children="I am secondary"
    />
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="danger"
      children="I am danger"
    />
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="warning"
      children="I am warning"
    />
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="success"
      children="I am success"
    />
    <Link
      href="https://ui.backstage.io"
      variant="title-small"
      color="info"
      children="I am info"
    />
  </Flex>
);
`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const AllWeights = () => (
  <Flex gap="4" direction="column">
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="title-large"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-large"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="title-medium"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-medium"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-small"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="title-x-small"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="title-x-small"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="body-large"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-large"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="body-medium"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-medium"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="body-small"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-small"
        weight="bold"
        children="A turtle"
      />
    </Flex>
    <Flex>
      <Link
        href="https://ui.backstage.io"
        variant="body-x-small"
        weight="regular"
        children="A fox"
      />
      <Link
        href="https://ui.backstage.io"
        variant="body-x-small"
        weight="bold"
        children="A turtle"
      />
    </Flex>
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const Truncate = () => (
  <Link href="/" truncate style={{ width: "480px" }}>
    A man looks at a painting in a museum and says, “Brothers and sisters I have
    none, but that man's father is my father's son.” Who is in the painting?
  </Link>
);
`,...h.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const Standalone = () => (
  <Link href="/" standalone>
    Standalone link (no underline by default)
  </Link>
);
`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const StandaloneComparison = () => (
  <Flex gap="4" direction="column">
    <Text>Default link (underline by default):</Text>
    <Link href="/" children="Sign up for Backstage" />
    <Text>Standalone link (underline on hover only):</Text>
    <Link href="/" standalone children="Sign up for Backstage" />
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Responsive = () => (
  <Link
    variant={{
      xs: "title-x-small",
      md: "body-x-small",
    }}
  >
    Link
  </Link>
);
`,...p.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    href: '/',
    children: 'Sign up for Backstage'
  }
})`,...i.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    href: 'https://backstage.io',
    children: 'Sign up for Backstage',
    target: '_blank'
  }
})`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args
  },
  render: args => <Flex gap="4" direction="column">
      <Link href="https://ui.backstage.io" variant="title-large" {...args} />
      <Link href="https://ui.backstage.io" variant="title-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="title-small" {...args} />
      <Link href="https://ui.backstage.io" variant="title-x-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-large" {...args} />
      <Link href="https://ui.backstage.io" variant="body-medium" {...args} />
      <Link href="https://ui.backstage.io" variant="body-small" {...args} />
      <Link href="https://ui.backstage.io" variant="body-x-small" {...args} />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex gap="4" direction="column">
      <Link href="https://ui.backstage.io" variant="title-small" color="primary" children="I am primary" />
      <Link href="https://ui.backstage.io" variant="title-small" color="secondary" children="I am secondary" />
      <Link href="https://ui.backstage.io" variant="title-small" color="danger" children="I am danger" />
      <Link href="https://ui.backstage.io" variant="title-small" color="warning" children="I am warning" />
      <Link href="https://ui.backstage.io" variant="title-small" color="success" children="I am success" />
      <Link href="https://ui.backstage.io" variant="title-small" color="info" children="I am info" />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex gap="4" direction="column">
      <Flex>
        <Link href="https://ui.backstage.io" variant="title-large" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="title-large" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="title-medium" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="title-medium" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="title-small" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="title-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="title-x-small" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="title-x-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="body-large" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="body-large" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="body-medium" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="body-medium" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="body-small" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="body-small" weight="bold" children="A turtle" />
      </Flex>
      <Flex>
        <Link href="https://ui.backstage.io" variant="body-x-small" weight="regular" children="A fox" />
        <Link href="https://ui.backstage.io" variant="body-x-small" weight="bold" children="A turtle" />
      </Flex>
    </Flex>
})`,...c.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: "A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?",
    href: '/',
    truncate: true,
    style: {
      width: '480px'
    }
  }
})`,...h.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    href: '/',
    children: 'Standalone link (no underline by default)',
    standalone: true
  }
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex gap="4" direction="column">
      <Text>Default link (underline by default):</Text>
      <Link href="/" children="Sign up for Backstage" />
      <Text>Standalone link (underline on hover only):</Text>
      <Link href="/" standalone children="Sign up for Backstage" />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    variant: {
      xs: 'title-x-small',
      md: 'body-x-small'
    }
  }
})`,...p.input.parameters?.docs?.source}}};const D=["Default","ExternalLink","AllVariants","AllColors","AllWeights","Truncate","Standalone","StandaloneComparison","Responsive"];export{o as AllColors,l as AllVariants,c as AllWeights,i as Default,s as ExternalLink,p as Responsive,u as Standalone,d as StandaloneComparison,h as Truncate,D as __namedExportsOrder};
