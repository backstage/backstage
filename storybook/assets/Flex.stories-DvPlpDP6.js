import{p as f,j as e}from"./iframe-CIst4AKw.js";import{F as t}from"./Flex-DONnbgv1.js";import{B as w}from"./Box-2-OygA3y.js";import{T as D}from"./Text-rYKqQgpD.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-07Fon270.js";import"./useBg-55zBmT0q.js";import"./defineComponent-CprPFFQb.js";const a=f.meta({title:"Backstage UI/Flex",component:t,argTypes:{align:{control:"inline-radio",options:["start","center","end","baseline","stretch"]},justify:{control:"inline-radio",options:["start","center","end","between"]},direction:{control:"inline-radio",options:["row","column","row-reverse","column-reverse"]}}}),r=({width:n="48px",height:y="48px"})=>{const j=(()=>{const b=`
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();return`data:image/svg+xml,${encodeURIComponent(b)}`})();return e.jsx(w,{width:n,height:y,style:{background:"#eaf2fd",borderRadius:"4px",border:"1px solid #2563eb",backgroundImage:`url("${j}")`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"#2563eb"}})},s=a.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}}),o=a.story({args:{...s.input.args,direction:"column"}}),i=a.story({args:{...s.input.args,direction:"row"}}),c=a.story({args:{align:"start",direction:"column"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),p=a.story({args:{align:"start",direction:"row"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),u=a.story({args:{align:"center",direction:"column"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),l=a.story({args:{align:"center",direction:"row"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),x=a.story({args:{align:"end",direction:"column"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),d=a.story({args:{align:"end",direction:"row"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),g=a.story({args:{align:{xs:"start",md:"center",lg:"end"}},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),m=a.story({args:{gap:{xs:"4",md:"8",lg:"12"}},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}),h=a.story({args:{gap:"8"},render:n=>e.jsxs(t,{...n,children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}),F=a.story({render:()=>e.jsxs(t,{direction:"row",gap:"8",children:[e.jsx(t,{children:e.jsx(D,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})}),e.jsx(t,{children:e.jsx(D,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})})]})}),v=a.story({args:{px:"6",py:"4"},render:n=>e.jsxs(t,{align:"center",style:{flexWrap:"wrap"},children:[e.jsx(t,{...n,children:"Default"}),e.jsx(t,{bg:"neutral-1",...n,children:"Neutral 1"}),e.jsx(t,{bg:"neutral-2",...n,children:"Neutral 2"}),e.jsx(t,{bg:"neutral-3",...n,children:"Neutral 3"}),e.jsx(t,{bg:{initial:"neutral-1",sm:"neutral-2"},...n,children:"Responsive Bg"}),e.jsx(t,{bg:"danger",...n,children:"Danger"}),e.jsx(t,{bg:"warning",...n,children:"Warning"}),e.jsx(t,{bg:"success",...n,children:"Success"})]})}),B=a.story({args:{px:"6",py:"4",gap:"4"},render:n=>e.jsxs(t,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:'Using bg="neutral-auto" on Flex auto-increments from the parent context. The first Flex defaults to neutral-1 (no parent), then each nested Flex increments by one, capping at neutral-3.'}),e.jsxs(t,{...n,bg:"neutral-auto",direction:"column",children:[e.jsx("div",{children:"Neutral 1 (auto, no parent)"}),e.jsxs(t,{...n,bg:"neutral-auto",direction:"column",children:[e.jsx("div",{children:"Neutral 2 (auto-incremented)"}),e.jsx(t,{...n,bg:"neutral-auto",direction:"column",children:e.jsx("div",{children:"Neutral 3 (auto-incremented, capped)"})})]})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const AlignCenterInRow = () => (
  <Flex align="center" direction="row">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const AlignEndInColumn = () => (
  <Flex align="end" direction="column">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...x.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const AlignEndInRow = () => (
  <Flex align="end" direction="row">
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const ResponsiveAlign = () => (
  <Flex align={{ xs: "start", md: "center", lg: "end" }}>
    <DecorativeBox height="32px" />
    <DecorativeBox height="24px" />
    <DecorativeBox height="48px" />
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const ResponsiveGap = () => (
  <Flex gap={{ xs: "4", md: "8", lg: "12" }}>
    <DecorativeBox />
    <DecorativeBox />
    <DecorativeBox />
  </Flex>
);
`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const LargeGap = () => (
  <Flex gap="8">
    <DecorativeBox />
    <DecorativeBox />
    <DecorativeBox />
  </Flex>
);
`,...h.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{code:`const WithTextTruncate = () => (
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
`,...F.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const Backgrounds = () => (
  <Flex align="center" style={{ flexWrap: "wrap" }}>
    <Flex px="6" py="4">
      Default
    </Flex>
    <Flex bg="neutral-1" px="6" py="4">
      Neutral 1
    </Flex>
    <Flex bg="neutral-2" px="6" py="4">
      Neutral 2
    </Flex>
    <Flex bg="neutral-3" px="6" py="4">
      Neutral 3
    </Flex>
    <Flex bg={{ initial: "neutral-1", sm: "neutral-2" }} px="6" py="4">
      Responsive Bg
    </Flex>
    <Flex bg="danger" px="6" py="4">
      Danger
    </Flex>
    <Flex bg="warning" px="6" py="4">
      Warning
    </Flex>
    <Flex bg="success" px="6" py="4">
      Success
    </Flex>
  </Flex>
);
`,...v.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const BgNeutralAuto = () => (
  <Flex direction="column">
    <div style={{ maxWidth: "600px", marginBottom: "16px" }}>
      Using bg="neutral-auto" on Flex auto-increments from the parent context.
      The first Flex defaults to neutral-1 (no parent), then each nested Flex
      increments by one, capping at neutral-3.
    </div>
    <Flex px="6" py="4" gap="4" bg="neutral-auto" direction="column">
      <div>Neutral 1 (auto, no parent)</div>
      <Flex px="6" py="4" gap="4" bg="neutral-auto" direction="column">
        <div>Neutral 2 (auto-incremented)</div>
        <Flex px="6" py="4" gap="4" bg="neutral-auto" direction="column">
          <div>Neutral 3 (auto-incremented, capped)</div>
        </Flex>
      </Flex>
    </Flex>
  </Flex>
);
`,...B.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...x.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    gap: '8'
  },
  render: args => <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...F.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex align="center" style={{
    flexWrap: 'wrap'
  }}>
      <Flex {...args}>Default</Flex>
      <Flex bg="neutral-1" {...args}>
        Neutral 1
      </Flex>
      <Flex bg="neutral-2" {...args}>
        Neutral 2
      </Flex>
      <Flex bg="neutral-3" {...args}>
        Neutral 3
      </Flex>
      <Flex bg={{
      initial: 'neutral-1',
      sm: 'neutral-2'
    }} {...args}>
        Responsive Bg
      </Flex>
      <Flex bg="danger" {...args}>
        Danger
      </Flex>
      <Flex bg="warning" {...args}>
        Warning
      </Flex>
      <Flex bg="success" {...args}>
        Success
      </Flex>
    </Flex>
})`,...v.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
        Using bg="neutral-auto" on Flex auto-increments from the parent context.
        The first Flex defaults to neutral-1 (no parent), then each nested Flex
        increments by one, capping at neutral-3.
      </div>
      <Flex {...args} bg="neutral-auto" direction="column">
        <div>Neutral 1 (auto, no parent)</div>
        <Flex {...args} bg="neutral-auto" direction="column">
          <div>Neutral 2 (auto-incremented)</div>
          <Flex {...args} bg="neutral-auto" direction="column">
            <div>Neutral 3 (auto-incremented, capped)</div>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
})`,...B.input.parameters?.docs?.source}}};const E=["Default","ColumnDirection","RowDirection","AlignStartInColumn","AlignStartInRow","AlignCenterInColumn","AlignCenterInRow","AlignEndInColumn","AlignEndInRow","ResponsiveAlign","ResponsiveGap","LargeGap","WithTextTruncate","Backgrounds","BgNeutralAuto"];export{u as AlignCenterInColumn,l as AlignCenterInRow,x as AlignEndInColumn,d as AlignEndInRow,c as AlignStartInColumn,p as AlignStartInRow,v as Backgrounds,B as BgNeutralAuto,o as ColumnDirection,s as Default,h as LargeGap,g as ResponsiveAlign,m as ResponsiveGap,i as RowDirection,F as WithTextTruncate,E as __namedExportsOrder};
