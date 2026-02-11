import{r as w,j as e,p as F}from"./iframe-BJyhMgZx.js";import{c as j}from"./clsx-B-dksMZM.js";import{a as v}from"./useStyles-BsgyHTwE.js";import{u as S,B as f}from"./useBg-BYWymq_j.js";import{B}from"./Box-BLNEr2aV.js";import{F as m}from"./Flex-Djm5LFkK.js";import"./preload-helper-PPVm8Dsz.js";import"./defineComponent-D70sFb1K.js";const k={classNames:{root:"bui-Grid"},utilityProps:["columns","gap","m","mb","ml","mr","mt","mx","my","p","pb","pl","pr","pt","px","py"],dataAttributes:{bg:["neutral-1","neutral-2","neutral-3","danger","warning","success"]}},C={classNames:{root:"bui-GridItem"},utilityProps:["colSpan","colEnd","colStart","rowSpan"],dataAttributes:{bg:["neutral-1","neutral-2","neutral-3","danger","warning","success"]}},D={"bui-Grid":"_bui-Grid_1lv2x_20","bui-GridItem":"_bui-GridItem_1lv2x_25"},E=w.forwardRef((r,x)=>{const{bg:n}=S(r.bg),{classNames:u,dataAttributes:G,utilityClasses:R,style:b,cleanedProps:h}=v(k,{columns:"auto",gap:"4",...r,bg:n}),{className:y,bg:N,...I}=h,g=e.jsx("div",{ref:x,className:j(u.root,R,D[u.root],y),style:b,...G,...I});return n?e.jsx(f,{bg:n,children:g}):g}),A=w.forwardRef((r,x)=>{const{bg:n}=S(r.bg),{classNames:u,dataAttributes:G,utilityClasses:R,style:b,cleanedProps:h}=v(C,{...r,bg:n}),{className:y,bg:N,...I}=h,g=e.jsx("div",{ref:x,className:j(u.root,R,D[u.root],y),style:b,...G,...I});return n?e.jsx(f,{bg:n,children:g}):g}),t={Root:E,Item:A},c=F.meta({title:"Backstage UI/Grid",component:t.Root,tags:["!manifest"]}),p=()=>e.jsx(B,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),o=c.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(p,{}),e.jsx(p,{}),e.jsx(p,{})]})}}),i=c.story({args:{...o.input.args,gap:"64px"}}),a=c.story({args:{columns:"12"},render:r=>e.jsx(m,{gap:"4",direction:"column",children:Array.from({length:11},(x,n)=>w.createElement(t.Root,{...r,key:n},e.jsx(t.Item,{colSpan:String(n+1),children:e.jsx(p,{})}),e.jsx(t.Item,{colSpan:String(11-n),children:e.jsx(p,{})})))})}),s=c.story({args:{columns:"12"},render:r=>e.jsxs(t.Root,{...r,columns:"3",children:[e.jsx(t.Item,{colSpan:"1",rowSpan:"2",children:e.jsx(B,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),e.jsx(t.Item,{colSpan:"2",children:e.jsx(p,{})}),e.jsx(t.Item,{colSpan:"2",children:e.jsx(p,{})})]})}),d=c.story({args:{px:"6",py:"4"},render:r=>e.jsxs(m,{direction:"column",children:[e.jsxs(m,{style:{flexWrap:"wrap"},children:[e.jsx(t.Root,{...r,bg:"neutral-1",children:"Neutral 1"}),e.jsx(t.Root,{...r,bg:"neutral-2",children:"Neutral 2"}),e.jsx(t.Root,{...r,bg:"neutral-3",children:"Neutral 3"}),e.jsx(t.Root,{...r,bg:{initial:"neutral-1",sm:"neutral-2"},children:"Responsive Bg"}),e.jsx(t.Root,{...r,bg:"danger",children:"Danger"}),e.jsx(t.Root,{...r,bg:"warning",children:"Warning"}),e.jsx(t.Root,{...r,bg:"success",children:"Success"})]}),e.jsxs(m,{style:{flexWrap:"wrap"},children:[e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"neutral-1",style:{padding:"4px"},children:"Neutral 1"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"neutral-2",style:{padding:"4px"},children:"Neutral 2"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"neutral-3",style:{padding:"4px"},children:"Neutral 3"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:{initial:"neutral-1",sm:"neutral-2"},style:{padding:"4px"},children:"Responsive Bg"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"danger",style:{padding:"4px"},children:"Danger"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"warning",style:{padding:"4px"},children:"Warning"})}),e.jsx(t.Root,{...r,children:e.jsx(t.Item,{bg:"success",style:{padding:"4px"},children:"Success"})})]})]})}),l=c.story({args:{px:"6",py:"4",columns:"2",gap:"4"},render:r=>e.jsxs(m,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:"Grid is a layout primitive and is transparent to the bg system by default. Only an explicit bg prop establishes a new bg level. Nested grids without a bg prop inherit the parent context unchanged."}),e.jsxs(t.Root,{...r,bg:"neutral-1",children:[e.jsx(t.Item,{children:"Neutral 1 (Grid.Root)"}),e.jsx(t.Item,{children:e.jsxs(t.Root,{...r,bg:"neutral-2",children:[e.jsx(t.Item,{children:"Nested: neutral-2 (explicit)"}),e.jsx(t.Item,{children:"Nested: neutral-2 (explicit)"})]})})]})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{code:`const Default = () => (
  <Grid.Root>
    (
    <>
      <FakeBox />
      <FakeBox />
      <FakeBox />
    </>
    )
  </Grid.Root>
);
`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const LargeGap = () => <Grid.Root gap="64px" />;
`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const ColumnSizes = (args) => (
  <Flex gap="4" direction="column">
    {Array.from({ length: 11 }, (_, i) => (
      <Grid.Root {...args} key={i}>
        <Grid.Item colSpan={String(i + 1) as GridItemProps["colSpan"]}>
          <FakeBox />
        </Grid.Item>
        <Grid.Item colSpan={String(11 - i) as GridItemProps["colSpan"]}>
          <FakeBox />
        </Grid.Item>
      </Grid.Root>
    ))}
  </Flex>
);
`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const RowAndColumns = () => (
  <Grid.Root columns="3">
    <Grid.Item colSpan="1" rowSpan="2">
      <Box
        style={{
          height: "100%",
          background: "#eaf2fd",
          borderRadius: "4px",
          boxShadow: "0 0 0 1px #2563eb",
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")',
        }}
      />
    </Grid.Item>
    <Grid.Item colSpan="2">
      <FakeBox />
    </Grid.Item>
    <Grid.Item colSpan="2">
      <FakeBox />
    </Grid.Item>
  </Grid.Root>
);
`,...s.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const Backgrounds = () => (
  <Flex direction="column">
    <Flex style={{ flexWrap: "wrap" }}>
      <Grid.Root px="6" py="4" bg="neutral-1">
        Neutral 1
      </Grid.Root>
      <Grid.Root px="6" py="4" bg="neutral-2">
        Neutral 2
      </Grid.Root>
      <Grid.Root px="6" py="4" bg="neutral-3">
        Neutral 3
      </Grid.Root>
      <Grid.Root px="6" py="4" bg={{ initial: "neutral-1", sm: "neutral-2" }}>
        Responsive Bg
      </Grid.Root>
      <Grid.Root px="6" py="4" bg="danger">
        Danger
      </Grid.Root>
      <Grid.Root px="6" py="4" bg="warning">
        Warning
      </Grid.Root>
      <Grid.Root px="6" py="4" bg="success">
        Success
      </Grid.Root>
    </Flex>
    <Flex style={{ flexWrap: "wrap" }}>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="neutral-1" style={{ padding: "4px" }}>
          Neutral 1
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="neutral-2" style={{ padding: "4px" }}>
          Neutral 2
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="neutral-3" style={{ padding: "4px" }}>
          Neutral 3
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item
          bg={{ initial: "neutral-1", sm: "neutral-2" }}
          style={{ padding: "4px" }}
        >
          Responsive Bg
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="danger" style={{ padding: "4px" }}>
          Danger
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="warning" style={{ padding: "4px" }}>
          Warning
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item bg="success" style={{ padding: "4px" }}>
          Success
        </Grid.Item>
      </Grid.Root>
    </Flex>
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const BgNeutralAuto = () => (
  <Flex direction="column">
    <div style={{ maxWidth: "600px", marginBottom: "16px" }}>
      Grid is a layout primitive and is transparent to the bg system by default.
      Only an explicit bg prop establishes a new bg level. Nested grids without
      a bg prop inherit the parent context unchanged.
    </div>
    <Grid.Root px="6" py="4" columns="2" gap="4" bg="neutral-1">
      <Grid.Item>Neutral 1 (Grid.Root)</Grid.Item>
      <Grid.Item>
        <Grid.Root px="6" py="4" columns="2" gap="4" bg="neutral-2">
          <Grid.Item>Nested: neutral-2 (explicit)</Grid.Item>
          <Grid.Item>Nested: neutral-2 (explicit)</Grid.Item>
        </Grid.Root>
      </Grid.Item>
    </Grid.Root>
  </Flex>
);
`,...l.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
})`,...o.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    gap: '64px'
  }
})`,...i.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    columns: '12'
  },
  render: args => <Flex gap="4" direction="column">
      {Array.from({
      length: 11
    }, (_, i) => <Grid.Root {...args} key={i}>
          <Grid.Item colSpan={String(i + 1) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
          <Grid.Item colSpan={String(11 - i) as GridItemProps['colSpan']}>
            <FakeBox />
          </Grid.Item>
        </Grid.Root>)}
    </Flex>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    columns: '12'
  },
  render: args => <Grid.Root {...args} columns="3">
      <Grid.Item colSpan="1" rowSpan="2">
        <Box style={{
        height: '100%',
        background: '#eaf2fd',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px #2563eb',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'
      }} />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
    </Grid.Root>
})`,...s.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex direction="column">
      <Flex style={{
      flexWrap: 'wrap'
    }}>
        <Grid.Root {...args} bg="neutral-1">
          Neutral 1
        </Grid.Root>
        <Grid.Root {...args} bg="neutral-2">
          Neutral 2
        </Grid.Root>
        <Grid.Root {...args} bg="neutral-3">
          Neutral 3
        </Grid.Root>
        <Grid.Root {...args} bg={{
        initial: 'neutral-1',
        sm: 'neutral-2'
      }}>
          Responsive Bg
        </Grid.Root>
        <Grid.Root {...args} bg="danger">
          Danger
        </Grid.Root>
        <Grid.Root {...args} bg="warning">
          Warning
        </Grid.Root>
        <Grid.Root {...args} bg="success">
          Success
        </Grid.Root>
      </Flex>
      <Flex style={{
      flexWrap: 'wrap'
    }}>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-1" style={{
          padding: '4px'
        }}>
            Neutral 1
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-2" style={{
          padding: '4px'
        }}>
            Neutral 2
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="neutral-3" style={{
          padding: '4px'
        }}>
            Neutral 3
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg={{
          initial: 'neutral-1',
          sm: 'neutral-2'
        }} style={{
          padding: '4px'
        }}>
            Responsive Bg
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="danger" style={{
          padding: '4px'
        }}>
            Danger
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="warning" style={{
          padding: '4px'
        }}>
            Warning
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item bg="success" style={{
          padding: '4px'
        }}>
            Success
          </Grid.Item>
        </Grid.Root>
      </Flex>
    </Flex>
})`,...d.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4',
    columns: '2',
    gap: '4'
  },
  render: args => <Flex direction="column">
      <div style={{
      maxWidth: '600px',
      marginBottom: '16px'
    }}>
        Grid is a layout primitive and is transparent to the bg system by
        default. Only an explicit bg prop establishes a new bg level. Nested
        grids without a bg prop inherit the parent context unchanged.
      </div>
      <Grid.Root {...args} bg="neutral-1">
        <Grid.Item>Neutral 1 (Grid.Root)</Grid.Item>
        <Grid.Item>
          <Grid.Root {...args} bg="neutral-2">
            <Grid.Item>Nested: neutral-2 (explicit)</Grid.Item>
            <Grid.Item>Nested: neutral-2 (explicit)</Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </Flex>
})`,...l.input.parameters?.docs?.source}}};const V=["Default","LargeGap","ColumnSizes","RowAndColumns","Backgrounds","BgNeutralAuto"];export{d as Backgrounds,l as BgNeutralAuto,a as ColumnSizes,o as Default,i as LargeGap,s as RowAndColumns,V as __namedExportsOrder};
