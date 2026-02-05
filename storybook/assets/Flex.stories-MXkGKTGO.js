import{p as S,j as e}from"./iframe-M9O-K8SB.js";import{F as t}from"./Flex-Bz2InqMs.js";import{B as w}from"./Box-FY2l0ff9.js";import{T as y}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-BRwt6BXn.js";import"./useSurface-CJaN3YoD.js";import"./defineComponent-BmABoWOu.js";const a=S.meta({title:"Backstage UI/Flex",component:t,argTypes:{align:{control:"inline-radio",options:["start","center","end","baseline","stretch"]},justify:{control:"inline-radio",options:["start","center","end","between"]},direction:{control:"inline-radio",options:["row","column","row-reverse","column-reverse"]}}}),n=({width:r="48px",height:D="48px"})=>{const B=(()=>{const j=`
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();return`data:image/svg+xml,${encodeURIComponent(j)}`})();return e.jsx(w,{width:r,height:D,style:{background:"#eaf2fd",borderRadius:"4px",border:"1px solid #2563eb",backgroundImage:`url("${B}")`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"#2563eb"}})},s=a.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(n,{}),e.jsx(n,{}),e.jsx(n,{})]})}}),o=a.story({args:{...s.input.args,direction:"column"}}),i=a.story({args:{...s.input.args,direction:"row"}}),c=a.story({args:{align:"start",direction:"column"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),p=a.story({args:{align:"start",direction:"row"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),u=a.story({args:{align:"center",direction:"column"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),x=a.story({args:{align:"center",direction:"row"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),l=a.story({args:{align:"end",direction:"column"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),d=a.story({args:{align:"end",direction:"row"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),m=a.story({args:{align:{xs:"start",md:"center",lg:"end"}},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{height:"32px"}),e.jsx(n,{height:"24px"}),e.jsx(n,{height:"48px"})]})}),g=a.story({args:{gap:{xs:"4",md:"8",lg:"12"}},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{}),e.jsx(n,{}),e.jsx(n,{})]})}),h=a.story({args:{gap:"8"},render:r=>e.jsxs(t,{...r,children:[e.jsx(n,{}),e.jsx(n,{}),e.jsx(n,{})]})}),f=a.story({render:()=>e.jsxs(t,{direction:"row",gap:"8",children:[e.jsx(t,{children:e.jsx(y,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})}),e.jsx(t,{children:e.jsx(y,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})})]})}),v=a.story({args:{px:"6",py:"4"},render:r=>e.jsxs(t,{align:"center",style:{flexWrap:"wrap"},children:[e.jsx(t,{...r,children:"Default"}),e.jsx(t,{surface:"0",...r,children:"Surface 0"}),e.jsx(t,{surface:"1",...r,children:"Surface 1"}),e.jsx(t,{surface:"2",...r,children:"Surface 2"}),e.jsx(t,{surface:"3",...r,children:"Surface 3"}),e.jsx(t,{surface:{initial:"0",sm:"1"},...r,children:"Responsive Surface"}),e.jsx(t,{surface:"danger",...r,children:"Surface Danger"}),e.jsx(t,{surface:"warning",...r,children:"Surface Warning"}),e.jsx(t,{surface:"success",...r,children:"Surface Success"})]})}),F=a.story({args:{px:"6",py:"4",gap:"4"},render:r=>e.jsxs(t,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:'Using surface="auto" automatically increments from the parent surface. This allows components to be reusable without hardcoding surface levels.'}),e.jsxs(t,{...r,surface:"0",direction:"column",children:[e.jsx("div",{children:"Surface 0 (explicit)"}),e.jsxs(t,{...r,surface:"auto",direction:"column",children:[e.jsx("div",{children:"Surface auto (becomes 1)"}),e.jsxs(t,{...r,surface:"auto",direction:"column",children:[e.jsx("div",{children:"Surface auto (becomes 2)"}),e.jsxs(t,{...r,surface:"auto",direction:"column",children:[e.jsx("div",{children:"Surface auto (becomes 3)"}),e.jsx(t,{...r,surface:"auto",direction:"column",children:e.jsx("div",{children:"Surface auto (stays 3 - capped)"})})]})]})]})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
  <Flex>
    (
    <>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </>
    )
  </Flex>
);
`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const ColumnDirection = () => <Flex direction="column" />;
`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const RowDirection = () => <Flex direction="row" />;
`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const AlignStartInColumn = () => (
  <Flex align="start" direction="column">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const AlignStartInRow = () => (
  <Flex align="start" direction="row">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const AlignCenterInColumn = () => (
  <Flex align="center" direction="column">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const AlignCenterInRow = () => (
  <Flex align="center" direction="row">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...x.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const AlignEndInColumn = () => (
  <Flex align="end" direction="column">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const AlignEndInRow = () => (
  <Flex align="end" direction="row">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const ResponsiveAlign = () => (
  <Flex align={{ xs: "start", md: "center", lg: "end" }}>
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const ResponsiveGap = () => (
  <Flex gap={{ xs: "4", md: "8", lg: "12" }}>
    <DecorativeBox />
    <DecorativeBox />
    <DecorativeBox />
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const LargeGap = () => (
  <Flex gap="8">
    <DecorativeBox />
    <DecorativeBox />
    <DecorativeBox />
  </Flex>
);
`,...h.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{code:`const WithTextTruncate = () => (
  <Flex direction="row" gap="8">
    <Flex>
      <Text truncate>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Flex>
    <Flex>
      <Text truncate>
        A man looks at a painting in a museum and says, “Brothers and sisters I
        have none, but that man&apos;s father is my father&apos;s son.” Who is
        in the painting?
      </Text>
    </Flex>
  </Flex>
);
`,...f.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const Surfaces = () => (
  <Flex align="center" style={{ flexWrap: "wrap" }}>
    <Flex px="6" py="4">
      Default
    </Flex>
    <Flex surface="0" px="6" py="4">
      Surface 0
    </Flex>
    <Flex surface="1" px="6" py="4">
      Surface 1
    </Flex>
    <Flex surface="2" px="6" py="4">
      Surface 2
    </Flex>
    <Flex surface="3" px="6" py="4">
      Surface 3
    </Flex>
    <Flex surface={{ initial: "0", sm: "1" }} px="6" py="4">
      Responsive Surface
    </Flex>
    <Flex surface="danger" px="6" py="4">
      Surface Danger
    </Flex>
    <Flex surface="warning" px="6" py="4">
      Surface Warning
    </Flex>
    <Flex surface="success" px="6" py="4">
      Surface Success
    </Flex>
  </Flex>
);
`,...v.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const SurfacesAutoIncrement = () => (
  <Flex direction="column">
    <div style={{ maxWidth: "600px", marginBottom: "16px" }}>
      Using surface="auto" automatically increments from the parent surface.
      This allows components to be reusable without hardcoding surface levels.
    </div>
    <Flex px="6" py="4" gap="4" surface="0" direction="column">
      <div>Surface 0 (explicit)</div>
      <Flex px="6" py="4" gap="4" surface="auto" direction="column">
        <div>Surface auto (becomes 1)</div>
        <Flex px="6" py="4" gap="4" surface="auto" direction="column">
          <div>Surface auto (becomes 2)</div>
          <Flex px="6" py="4" gap="4" surface="auto" direction="column">
            <div>Surface auto (becomes 3)</div>
            <Flex px="6" py="4" gap="4" surface="auto" direction="column">
              <div>Surface auto (stays 3 - capped)</div>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
);
`,...F.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </>
  }
})`,...s.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'column'
  }
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'row'
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...x.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: {
      xs: 'start',
      md: 'center',
      lg: 'end'
    }
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    gap: {
      xs: '4',
      md: '8',
      lg: '12'
    }
  },
  render: args => <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    gap: '8'
  },
  render: args => <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="row" gap="8">
      <Flex>
        <Text truncate>
          A man looks at a painting in a museum and says, “Brothers and sisters
          I have none, but that man&apos;s father is my father&apos;s son.” Who
          is in the painting?
        </Text>
      </Flex>
      <Flex>
        <Text truncate>
          A man looks at a painting in a museum and says, “Brothers and sisters
          I have none, but that man&apos;s father is my father&apos;s son.” Who
          is in the painting?
        </Text>
      </Flex>
    </Flex>
})`,...f.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex align="center" style={{
    flexWrap: 'wrap'
  }}>
      <Flex {...args}>Default</Flex>
      <Flex surface="0" {...args}>
        Surface 0
      </Flex>
      <Flex surface="1" {...args}>
        Surface 1
      </Flex>
      <Flex surface="2" {...args}>
        Surface 2
      </Flex>
      <Flex surface="3" {...args}>
        Surface 3
      </Flex>
      <Flex surface={{
      initial: '0',
      sm: '1'
    }} {...args}>
        Responsive Surface
      </Flex>
      <Flex surface="danger" {...args}>
        Surface Danger
      </Flex>
      <Flex surface="warning" {...args}>
        Surface Warning
      </Flex>
      <Flex surface="success" {...args}>
        Surface Success
      </Flex>
    </Flex>
})`,...v.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4',
    gap: '4'
  },
  render: args => <Flex direction="column">
      <div style={{
      maxWidth: '600px',
      marginBottom: '16px'
    }}>
        Using surface="auto" automatically increments from the parent surface.
        This allows components to be reusable without hardcoding surface levels.
      </div>
      <Flex {...args} surface="0" direction="column">
        <div>Surface 0 (explicit)</div>
        <Flex {...args} surface="auto" direction="column">
          <div>Surface auto (becomes 1)</div>
          <Flex {...args} surface="auto" direction="column">
            <div>Surface auto (becomes 2)</div>
            <Flex {...args} surface="auto" direction="column">
              <div>Surface auto (becomes 3)</div>
              <Flex {...args} surface="auto" direction="column">
                <div>Surface auto (stays 3 - capped)</div>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
})`,...F.input.parameters?.docs?.source}}};const G=["Default","ColumnDirection","RowDirection","AlignStartInColumn","AlignStartInRow","AlignCenterInColumn","AlignCenterInRow","AlignEndInColumn","AlignEndInRow","ResponsiveAlign","ResponsiveGap","LargeGap","WithTextTruncate","Surfaces","SurfacesAutoIncrement"];export{u as AlignCenterInColumn,x as AlignCenterInRow,l as AlignEndInColumn,d as AlignEndInRow,c as AlignStartInColumn,p as AlignStartInRow,o as ColumnDirection,s as Default,h as LargeGap,m as ResponsiveAlign,g as ResponsiveGap,i as RowDirection,v as Surfaces,F as SurfacesAutoIncrement,f as WithTextTruncate,G as __namedExportsOrder};
