import{r as y,j as e,p as E}from"./iframe-M9O-K8SB.js";import{c as j}from"./clsx-B-dksMZM.js";import{u as w}from"./useStyles-BRwt6BXn.js";import{u as b,S as v}from"./useSurface-CJaN3YoD.js";import{B as D}from"./Box-FY2l0ff9.js";import{F as f}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./defineComponent-BmABoWOu.js";const k={classNames:{root:"bui-Grid"},utilityProps:["columns","gap","m","mb","ml","mr","mt","mx","my","p","pb","pl","pr","pt","px","py"],dataAttributes:{surface:["0","1","2","3","danger","warning","success"]}},B={classNames:{root:"bui-GridItem"},utilityProps:["colSpan","colEnd","colStart","rowSpan"],dataAttributes:{surface:["0","1","2","3","danger","warning","success"]}},F={"bui-Grid":"_bui-Grid_1hbjw_20","bui-GridItem":"_bui-GridItem_1hbjw_25"},A=y.forwardRef((t,x)=>{const{surface:o}=b({surface:t.surface}),{classNames:m,dataAttributes:G,utilityClasses:g,style:R,cleanedProps:S}=w(k,{columns:"auto",gap:"4",...t,surface:o}),{className:I,surface:C,...h}=S,l=e.jsx("div",{ref:x,className:j(m.root,g,F[m.root],I),style:R,...G,...h});return o?e.jsx(v,{surface:o,children:l}):l}),W=y.forwardRef((t,x)=>{const{surface:o}=b({surface:t.surface}),{classNames:m,dataAttributes:G,utilityClasses:g,style:R,cleanedProps:S}=w(B,{...t,surface:o}),{className:I,surface:C,...h}=S,l=e.jsx("div",{ref:x,className:j(m.root,g,F[m.root],I),style:R,...G,...h});return o?e.jsx(v,{surface:o,children:l}):l}),r={Root:A,Item:W},p=E.meta({title:"Backstage UI/Grid",component:r.Root,tags:["!manifest"]}),u=()=>e.jsx(D,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),a=p.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(u,{}),e.jsx(u,{}),e.jsx(u,{})]})}}),s=p.story({args:{...a.input.args,gap:"64px"}}),i=p.story({args:{columns:"12"},render:t=>e.jsx(f,{gap:"4",direction:"column",children:Array.from({length:11},(x,o)=>y.createElement(r.Root,{...t,key:o},e.jsx(r.Item,{colSpan:String(o+1),children:e.jsx(u,{})}),e.jsx(r.Item,{colSpan:String(11-o),children:e.jsx(u,{})})))})}),n=p.story({args:{columns:"12"},render:t=>e.jsxs(r.Root,{...t,columns:"3",children:[e.jsx(r.Item,{colSpan:"1",rowSpan:"2",children:e.jsx(D,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),e.jsx(r.Item,{colSpan:"2",children:e.jsx(u,{})}),e.jsx(r.Item,{colSpan:"2",children:e.jsx(u,{})})]})}),c=p.story({args:{px:"6",py:"4"},render:t=>e.jsxs(f,{direction:"column",children:[e.jsxs(f,{style:{flexWrap:"wrap"},children:[e.jsx(r.Root,{...t,surface:"0",children:"Surface 0"}),e.jsx(r.Root,{...t,surface:"1",children:"Surface 1"}),e.jsx(r.Root,{...t,surface:"2",children:"Surface 2"}),e.jsx(r.Root,{...t,surface:"3",children:"Surface 3"}),e.jsx(r.Root,{...t,surface:{initial:"0",sm:"1"},children:"Responsive Surface"}),e.jsx(r.Root,{...t,surface:"danger",children:"Surface Danger"}),e.jsx(r.Root,{...t,surface:"warning",children:"Surface Warning"}),e.jsx(r.Root,{...t,surface:"success",children:"Surface Success"})]}),e.jsxs(f,{style:{flexWrap:"wrap"},children:[e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"0",style:{padding:"4px"},children:"Surface 0"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"1",style:{padding:"4px"},children:"Surface 1"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"2",style:{padding:"4px"},children:"Surface 2"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"3",style:{padding:"4px"},children:"Surface 3"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:{initial:"0",sm:"1"},style:{padding:"4px"},children:"Responsive Surface"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"danger",style:{padding:"4px"},children:"Surface Danger"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"warning",style:{padding:"4px"},children:"Surface Warning"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{surface:"success",style:{padding:"4px"},children:"Surface Success"})})]})]})}),d=p.story({args:{px:"6",py:"4",columns:"2",gap:"4"},render:t=>e.jsxs(f,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:'Using surface="auto" automatically increments from the parent surface. Each Grid.Item with auto will be one level above its Grid.Root parent.'}),e.jsxs(r.Root,{...t,surface:"0",children:[e.jsx(r.Item,{children:"Surface 0 (Grid.Root)"}),e.jsx(r.Item,{surface:"auto",children:"Surface auto (becomes 1)"}),e.jsx(r.Item,{children:e.jsxs(r.Root,{...t,surface:"auto",children:[e.jsx(r.Item,{children:"Nested: Surface auto (becomes 1)"}),e.jsx(r.Item,{surface:"auto",children:"Nested: Surface auto (becomes 2)"})]})})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Default = () => (
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
`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const LargeGap = () => <Grid.Root gap="64px" />;
`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const ColumnSizes = (args) => (
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
`,...i.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{code:`const RowAndColumns = () => (
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
`,...n.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Surfaces = () => (
  <Flex direction="column">
    <Flex style={{ flexWrap: "wrap" }}>
      <Grid.Root px="6" py="4" surface="0">
        Surface 0
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="1">
        Surface 1
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="2">
        Surface 2
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="3">
        Surface 3
      </Grid.Root>
      <Grid.Root px="6" py="4" surface={{ initial: "0", sm: "1" }}>
        Responsive Surface
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="danger">
        Surface Danger
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="warning">
        Surface Warning
      </Grid.Root>
      <Grid.Root px="6" py="4" surface="success">
        Surface Success
      </Grid.Root>
    </Flex>
    <Flex style={{ flexWrap: "wrap" }}>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="0" style={{ padding: "4px" }}>
          Surface 0
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="1" style={{ padding: "4px" }}>
          Surface 1
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="2" style={{ padding: "4px" }}>
          Surface 2
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="3" style={{ padding: "4px" }}>
          Surface 3
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item
          surface={{ initial: "0", sm: "1" }}
          style={{ padding: "4px" }}
        >
          Responsive Surface
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="danger" style={{ padding: "4px" }}>
          Surface Danger
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="warning" style={{ padding: "4px" }}>
          Surface Warning
        </Grid.Item>
      </Grid.Root>
      <Grid.Root px="6" py="4">
        <Grid.Item surface="success" style={{ padding: "4px" }}>
          Surface Success
        </Grid.Item>
      </Grid.Root>
    </Flex>
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const SurfacesAutoIncrement = () => (
  <Flex direction="column">
    <div style={{ maxWidth: "600px", marginBottom: "16px" }}>
      Using surface="auto" automatically increments from the parent surface.
      Each Grid.Item with auto will be one level above its Grid.Root parent.
    </div>
    <Grid.Root px="6" py="4" columns="2" gap="4" surface="0">
      <Grid.Item>Surface 0 (Grid.Root)</Grid.Item>
      <Grid.Item surface="auto">Surface auto (becomes 1)</Grid.Item>
      <Grid.Item>
        <Grid.Root px="6" py="4" columns="2" gap="4" surface="auto">
          <Grid.Item>Nested: Surface auto (becomes 1)</Grid.Item>
          <Grid.Item surface="auto">Nested: Surface auto (becomes 2)</Grid.Item>
        </Grid.Root>
      </Grid.Item>
    </Grid.Root>
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    gap: '64px'
  }
})`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...i.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...n.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex direction="column">
      <Flex style={{
      flexWrap: 'wrap'
    }}>
        <Grid.Root {...args} surface="0">
          Surface 0
        </Grid.Root>
        <Grid.Root {...args} surface="1">
          Surface 1
        </Grid.Root>
        <Grid.Root {...args} surface="2">
          Surface 2
        </Grid.Root>
        <Grid.Root {...args} surface="3">
          Surface 3
        </Grid.Root>
        <Grid.Root {...args} surface={{
        initial: '0',
        sm: '1'
      }}>
          Responsive Surface
        </Grid.Root>
        <Grid.Root {...args} surface="danger">
          Surface Danger
        </Grid.Root>
        <Grid.Root {...args} surface="warning">
          Surface Warning
        </Grid.Root>
        <Grid.Root {...args} surface="success">
          Surface Success
        </Grid.Root>
      </Flex>
      <Flex style={{
      flexWrap: 'wrap'
    }}>
        <Grid.Root {...args}>
          <Grid.Item surface="0" style={{
          padding: '4px'
        }}>
            Surface 0
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="1" style={{
          padding: '4px'
        }}>
            Surface 1
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="2" style={{
          padding: '4px'
        }}>
            Surface 2
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="3" style={{
          padding: '4px'
        }}>
            Surface 3
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface={{
          initial: '0',
          sm: '1'
        }} style={{
          padding: '4px'
        }}>
            Responsive Surface
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="danger" style={{
          padding: '4px'
        }}>
            Surface Danger
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="warning" style={{
          padding: '4px'
        }}>
            Surface Warning
          </Grid.Item>
        </Grid.Root>
        <Grid.Root {...args}>
          <Grid.Item surface="success" style={{
          padding: '4px'
        }}>
            Surface Success
          </Grid.Item>
        </Grid.Root>
      </Flex>
    </Flex>
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
        Using surface="auto" automatically increments from the parent surface.
        Each Grid.Item with auto will be one level above its Grid.Root parent.
      </div>
      <Grid.Root {...args} surface="0">
        <Grid.Item>Surface 0 (Grid.Root)</Grid.Item>
        <Grid.Item surface="auto">Surface auto (becomes 1)</Grid.Item>
        <Grid.Item>
          <Grid.Root {...args} surface="auto">
            <Grid.Item>Nested: Surface auto (becomes 1)</Grid.Item>
            <Grid.Item surface="auto">
              Nested: Surface auto (becomes 2)
            </Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </Flex>
})`,...d.input.parameters?.docs?.source}}};const V=["Default","LargeGap","ColumnSizes","RowAndColumns","Surfaces","SurfacesAutoIncrement"];export{i as ColumnSizes,a as Default,s as LargeGap,n as RowAndColumns,c as Surfaces,d as SurfacesAutoIncrement,V as __namedExportsOrder};
