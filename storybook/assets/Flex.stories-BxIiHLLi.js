import{j as e,B as y,p as w}from"./iframe-DgHKkkyr.js";import{F as n}from"./Flex-C1C4BYK1.js";import{T as B}from"./Text-DfksO4NV.js";import"./preload-helper-PPVm8Dsz.js";const a=w.meta({title:"Backstage UI/Flex",component:n,argTypes:{align:{control:"inline-radio",options:["start","center","end","baseline","stretch"]},justify:{control:"inline-radio",options:["start","center","end","between"]},direction:{control:"inline-radio",options:["row","column","row-reverse","column-reverse"]}},args:{children:null}}),t=({width:r="48px",height:D="48px"})=>{const b=(()=>{const f=`
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();return`data:image/svg+xml,${encodeURIComponent(f)}`})();return e.jsx(y,{width:r,height:D,style:{background:"#eaf2fd",borderRadius:"4px",border:"1px solid #2563eb",backgroundImage:`url("${b}")`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"#2563eb"},children:null})},s=a.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}}),i=a.story({args:{...s.input.args,direction:"column"}}),o=a.story({args:{...s.input.args,direction:"row"}}),c=a.story({args:{align:"start",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),l=a.story({args:{align:"start",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),p=a.story({args:{align:"center",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),x=a.story({args:{align:"center",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),g=a.story({args:{align:"end",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),u=a.story({args:{align:"end",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),d=a.story({args:{align:{xs:"start",md:"center",lg:"end"}},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),h=a.story({args:{gap:{xs:"4",md:"8",lg:"12"}},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}),m=a.story({args:{gap:"8"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}),j=a.story({render:()=>e.jsxs(n,{direction:"row",gap:"8",children:[e.jsx(n,{children:e.jsx(B,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})}),e.jsx(n,{children:e.jsx(B,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})})]})}),v=a.story({args:{px:"6",py:"4"},render:r=>e.jsxs(n,{align:"center",style:{flexWrap:"wrap"},children:[e.jsx(n,{...r,children:"Default"}),e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 1)"}),e.jsx(y,{bg:"neutral",children:e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 2)"})}),e.jsx(y,{bg:"neutral",children:e.jsx(y,{bg:"neutral",children:e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 3)"})})}),e.jsx(n,{bg:"danger",...r,children:"Danger"}),e.jsx(n,{bg:"warning",...r,children:"Warning"}),e.jsx(n,{bg:"success",...r,children:"Success"})]})}),F=a.story({args:{px:"6",py:"4",gap:"4"},render:r=>e.jsxs(n,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:'Using bg="neutral" on Flex auto-increments from the parent context. The first Flex defaults to neutral-1 (no parent), then each nested Flex increments by one, capping at neutral-3.'}),e.jsxs(n,{...r,bg:"neutral",direction:"column",children:[e.jsx("div",{children:"Neutral 1 (no parent)"}),e.jsxs(n,{...r,bg:"neutral",direction:"column",children:[e.jsx("div",{children:"Neutral 2 (auto-incremented)"}),e.jsx(n,{...r,bg:"neutral",direction:"column",children:e.jsx("div",{children:"Neutral 3 (auto-incremented, capped)"})})]})]})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </>
  }
})`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'column'
  }
})`,...i.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'row'
  }
})`,...o.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...p.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...x.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'end',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    px: '6',
    py: '4'
  },
  render: args => <Flex align="center" style={{
    flexWrap: 'wrap'
  }}>
      <Flex {...args}>Default</Flex>
      <Flex bg="neutral" {...args}>
        Neutral (level 1)
      </Flex>
      <Box bg="neutral">
        <Flex bg="neutral" {...args}>
          Neutral (level 2)
        </Flex>
      </Box>
      <Box bg="neutral">
        <Box bg="neutral">
          <Flex bg="neutral" {...args}>
            Neutral (level 3)
          </Flex>
        </Box>
      </Box>
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
        Using bg="neutral" on Flex auto-increments from the parent context. The
        first Flex defaults to neutral-1 (no parent), then each nested Flex
        increments by one, capping at neutral-3.
      </div>
      <Flex {...args} bg="neutral" direction="column">
        <div>Neutral 1 (no parent)</div>
        <Flex {...args} bg="neutral" direction="column">
          <div>Neutral 2 (auto-incremented)</div>
          <Flex {...args} bg="neutral" direction="column">
            <div>Neutral 3 (auto-incremented, capped)</div>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
})`,...F.input.parameters?.docs?.source}}};const C=["Default","ColumnDirection","RowDirection","AlignStartInColumn","AlignStartInRow","AlignCenterInColumn","AlignCenterInRow","AlignEndInColumn","AlignEndInRow","ResponsiveAlign","ResponsiveGap","LargeGap","WithTextTruncate","Backgrounds","BgNeutral"];export{p as AlignCenterInColumn,x as AlignCenterInRow,g as AlignEndInColumn,u as AlignEndInRow,c as AlignStartInColumn,l as AlignStartInRow,v as Backgrounds,F as BgNeutral,i as ColumnDirection,s as Default,m as LargeGap,d as ResponsiveAlign,h as ResponsiveGap,o as RowDirection,j as WithTextTruncate,C as __namedExportsOrder};
