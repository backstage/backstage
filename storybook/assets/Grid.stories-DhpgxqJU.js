import{bR as e,i as o,ca as x,c7 as m}from"./iframe-DogXi1kP.js";import{G as r}from"./Grid-DpOzkSVT.js";import{F as i}from"./Flex-Bi-SKTgz.js";import"./preload-helper-PPVm8Dsz.js";const n=m.meta({title:"Backstage UI/Grid",component:r.Root,tags:["!manifest"],args:{children:null}}),a=()=>e.jsx(o,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'},children:null}),s=n.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(a,{}),e.jsx(a,{}),e.jsx(a,{})]})}}),l=n.story({args:{...s.input.args,gap:"64px"}}),d=n.story({args:{columns:"12"},render:t=>e.jsx(i,{gap:"4",direction:"column",children:Array.from({length:11},(h,u)=>x.createElement(r.Root,{...t,key:u},e.jsx(r.Item,{colSpan:String(u+1),children:e.jsx(a,{})}),e.jsx(r.Item,{colSpan:String(11-u),children:e.jsx(a,{})})))})}),g=n.story({args:{columns:"12"},render:t=>e.jsxs(r.Root,{...t,columns:"3",children:[e.jsx(r.Item,{colSpan:"1",rowSpan:"2",children:e.jsx(o,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'},children:null})}),e.jsx(r.Item,{colSpan:"2",children:e.jsx(a,{})}),e.jsx(r.Item,{colSpan:"2",children:e.jsx(a,{})})]})}),c=n.story({args:{px:"6",py:"4"},render:t=>e.jsxs(i,{direction:"column",children:[e.jsxs(i,{style:{flexWrap:"wrap"},children:[e.jsx(r.Root,{...t,bg:"neutral",children:"Neutral (level 1)"}),e.jsx(o,{bg:"neutral",children:e.jsx(r.Root,{...t,bg:"neutral",children:"Neutral (level 2)"})}),e.jsx(o,{bg:"neutral",children:e.jsx(o,{bg:"neutral",children:e.jsx(r.Root,{...t,bg:"neutral",children:"Neutral (level 3)"})})}),e.jsx(r.Root,{...t,bg:"danger",children:"Danger"}),e.jsx(r.Root,{...t,bg:"warning",children:"Warning"}),e.jsx(r.Root,{...t,bg:"success",children:"Success"})]}),e.jsxs(i,{style:{flexWrap:"wrap"},children:[e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"neutral",style:{padding:"4px"},children:"Neutral (level 1)"})}),e.jsx(o,{bg:"neutral",children:e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"neutral",style:{padding:"4px"},children:"Neutral (level 2)"})})}),e.jsx(o,{bg:"neutral",children:e.jsx(o,{bg:"neutral",children:e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"neutral",style:{padding:"4px"},children:"Neutral (level 3)"})})})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"danger",style:{padding:"4px"},children:"Danger"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"warning",style:{padding:"4px"},children:"Warning"})}),e.jsx(r.Root,{...t,children:e.jsx(r.Item,{bg:"success",style:{padding:"4px"},children:"Success"})})]})]})}),p=n.story({args:{px:"6",py:"4",columns:"2",gap:"4"},render:t=>e.jsxs(i,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:"Grid is a layout primitive and is transparent to the bg system by default. Only an explicit bg prop establishes a new bg level. Nested grids without a bg prop inherit the parent context unchanged."}),e.jsxs(r.Root,{...t,bg:"neutral",children:[e.jsx(r.Item,{children:"Neutral 1 (Grid.Root)"}),e.jsx(r.Item,{children:e.jsxs(r.Root,{...t,bg:"neutral",children:[e.jsx(r.Item,{children:"Nested: neutral-2 (auto-incremented)"}),e.jsx(r.Item,{children:"Nested: neutral-2 (auto-incremented)"})]})})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
})`,...s.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    gap: '64px'
  }
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
      }} children={null} />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
      <Grid.Item colSpan="2">
        <FakeBox />
      </Grid.Item>
    </Grid.Root>
})`,...g.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex direction="column">
      <Flex style={{
      flexWrap: 'wrap'
    }}>
        <Grid.Root {...args} bg="neutral">
          Neutral (level 1)
        </Grid.Root>
        <Box bg="neutral">
          <Grid.Root {...args} bg="neutral">
            Neutral (level 2)
          </Grid.Root>
        </Box>
        <Box bg="neutral">
          <Box bg="neutral">
            <Grid.Root {...args} bg="neutral">
              Neutral (level 3)
            </Grid.Root>
          </Box>
        </Box>
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
          <Grid.Item bg="neutral" style={{
          padding: '4px'
        }}>
            Neutral (level 1)
          </Grid.Item>
        </Grid.Root>
        <Box bg="neutral">
          <Grid.Root {...args}>
            <Grid.Item bg="neutral" style={{
            padding: '4px'
          }}>
              Neutral (level 2)
            </Grid.Item>
          </Grid.Root>
        </Box>
        <Box bg="neutral">
          <Box bg="neutral">
            <Grid.Root {...args}>
              <Grid.Item bg="neutral" style={{
              padding: '4px'
            }}>
                Neutral (level 3)
              </Grid.Item>
            </Grid.Root>
          </Box>
        </Box>
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
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
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
      <Grid.Root {...args} bg="neutral">
        <Grid.Item>Neutral 1 (Grid.Root)</Grid.Item>
        <Grid.Item>
          <Grid.Root {...args} bg="neutral">
            <Grid.Item>Nested: neutral-2 (auto-incremented)</Grid.Item>
            <Grid.Item>Nested: neutral-2 (auto-incremented)</Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </Flex>
})`,...p.input.parameters?.docs?.source}}};const y=["Default","LargeGap","ColumnSizes","RowAndColumns","Backgrounds","BgNeutral"];export{c as Backgrounds,p as BgNeutral,d as ColumnSizes,s as Default,l as LargeGap,g as RowAndColumns,y as __namedExportsOrder};
