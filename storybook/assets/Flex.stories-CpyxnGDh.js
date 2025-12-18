import{a3 as w,j as e}from"./iframe-BY8lR-L8.js";import{F as n}from"./Flex-evfLyDkg.js";import{B as F}from"./Box-BoGdmCN9.js";import{T as v}from"./Text-DFii9vrK.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./useStyles-DPxfsz7Y.js";const s=w.meta({title:"Backstage UI/Flex",component:n,argTypes:{align:{control:"inline-radio",options:["start","center","end","baseline","stretch"]},justify:{control:"inline-radio",options:["start","center","end","between"]},direction:{control:"inline-radio",options:["row","column","row-reverse","column-reverse"]}}}),r=({width:t="48px",height:y="48px"})=>{const B=(()=>{const D=`
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();return`data:image/svg+xml,${encodeURIComponent(D)}`})();return e.jsx(F,{width:t,height:y,style:{background:"#eaf2fd",borderRadius:"4px",border:"1px solid #2563eb",backgroundImage:`url("${B}")`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"#2563eb"}})},a=s.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}}),o=s.story({args:{...a.input.args,direction:"column"}}),i=s.story({args:{...a.input.args,direction:"row"}}),c=s.story({args:{align:"start",direction:"column"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),p=s.story({args:{align:"start",direction:"row"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),g=s.story({args:{align:"center",direction:"column"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),x=s.story({args:{align:"center",direction:"row"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),u=s.story({args:{align:"end",direction:"column"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),l=s.story({args:{align:"end",direction:"row"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),d=s.story({args:{align:{xs:"start",md:"center",lg:"end"}},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{height:"32px"}),e.jsx(r,{height:"24px"}),e.jsx(r,{height:"48px"})]})}),h=s.story({args:{gap:{xs:"4",md:"8",lg:"12"}},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}),m=s.story({args:{gap:"8"},render:t=>e.jsxs(n,{...t,children:[e.jsx(r,{}),e.jsx(r,{}),e.jsx(r,{})]})}),j=s.story({render:()=>e.jsxs(n,{direction:"row",gap:"8",children:[e.jsx(n,{children:e.jsx(v,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})}),e.jsx(n,{children:e.jsx(v,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </>
  }
})`,...a.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...p.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...x.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...d.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...h.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    gap: '8'
  },
  render: args => <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};const T=["Default","ColumnDirection","RowDirection","AlignStartInColumn","AlignStartInRow","AlignCenterInColumn","AlignCenterInRow","AlignEndInColumn","AlignEndInRow","ResponsiveAlign","ResponsiveGap","LargeGap","WithTextTruncate"];export{g as AlignCenterInColumn,x as AlignCenterInRow,u as AlignEndInColumn,l as AlignEndInRow,c as AlignStartInColumn,p as AlignStartInRow,o as ColumnDirection,a as Default,m as LargeGap,d as ResponsiveAlign,h as ResponsiveGap,i as RowDirection,j as WithTextTruncate,T as __namedExportsOrder};
