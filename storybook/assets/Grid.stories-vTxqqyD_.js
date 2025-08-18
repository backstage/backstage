import{j as r}from"./jsx-runtime-hv06LKfz.js";import{r as m}from"./index-D8-PC79C.js";import{G as e}from"./Grid-5F3-jMFO.js";import{B as l}from"./Box-BVb6FGyq.js";import{F as c}from"./Flex-C_LlPGvM.js";import"./spacing.props-m9PQeFPu.js";import"./clsx-B-dksMZM.js";import"./useStyles-Dc-DqJ_c.js";const v={title:"Backstage UI/Grid",component:e.Root},o=()=>r.jsx(l,{style:{background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",height:"64px",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}}),a={args:{children:r.jsxs(r.Fragment,{children:[r.jsx(o,{}),r.jsx(o,{}),r.jsx(o,{})]})}},s={args:{...a.args,gap:"64px"}},t={args:{columns:"12"},render:i=>r.jsx(c,{gap:"4",direction:"column",children:Array.from({length:11},(g,d)=>m.createElement(e.Root,{...i,key:d},r.jsx(e.Item,{colSpan:String(d+1),children:r.jsx(o,{})}),r.jsx(e.Item,{colSpan:String(11-d),children:r.jsx(o,{})})))})},n={args:{columns:"12"},render:i=>r.jsxs(e.Root,{...i,columns:"3",children:[r.jsx(e.Item,{colSpan:"1",rowSpan:"2",children:r.jsx(l,{style:{height:"100%",background:"#eaf2fd",borderRadius:"4px",boxShadow:"0 0 0 1px #2563eb",backgroundImage:'url("data:image/svg+xml,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%232563eb%22%20fill-opacity%3D%220.3%22%20fill-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M5%200h1L0%206V5zM6%205v1H5z%22/%3E%3C/g%3E%3C/svg%3E")'}})}),r.jsx(e.Item,{colSpan:"2",children:r.jsx(o,{})}),r.jsx(e.Item,{colSpan:"2",children:r.jsx(o,{})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <FakeBox />
        <FakeBox />
        <FakeBox />
      </>
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    gap: '64px'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const G=["Default","LargeGap","ColumnSizes","RowAndColumns"];export{t as ColumnSizes,a as Default,s as LargeGap,n as RowAndColumns,G as __namedExportsOrder,v as default};
