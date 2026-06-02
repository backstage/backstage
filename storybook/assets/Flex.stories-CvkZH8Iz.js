import{bR as e,i as b,c7 as S}from"./iframe-DogXi1kP.js";import{F as n}from"./Flex-Bi-SKTgz.js";import{G as s}from"./Grid-DpOzkSVT.js";import{C as R,c as k,a as A,b as G}from"./Card-Bc-mJ_QX.js";import{T as o}from"./Text-BbRcKCRf.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-Fh9tm360.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./Label-BT3yvL3F.js";import"./Hidden-CYdnfqbh.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useLabel-DvnqIlMC.js";import"./useLabels-DnC-SBWU.js";import"./number-C2ZI7feN.js";import"./I18nProvider-Cag9fozJ.js";import"./useButton-C2CjCUzA.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./useHover-ox9S2Piy.js";import"./Link-D1uGA1pu.js";import"./useLink-C5PjbgXa.js";import"./useResolvedHref-BFQ7w248.js";import"./getNodeText-8Y9Za0Fs.js";const a=S.meta({title:"Backstage UI/Flex",component:n,argTypes:{align:{control:"inline-radio",options:["start","center","end","baseline","stretch"]},justify:{control:"inline-radio",options:["start","center","end","between"]},direction:{control:"inline-radio",options:["row","column","row-reverse","column-reverse"]}},args:{children:null}}),t=({width:r="48px",height:f="48px",style:D,...C})=>{const T=(()=>{const I=`
      <svg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <g fill="#2563eb" fill-opacity="0.6" fill-rule="evenodd">
          <path d="M5 0h1L0 6V5zM6 5v1H5z"/>
        </g>
      </svg>
    `.trim();return`data:image/svg+xml,${encodeURIComponent(I)}`})();return e.jsx(b,{...C,width:r,height:f,style:{...D,background:"#eaf2fd",borderRadius:"4px",border:"1px solid #2563eb",backgroundImage:`url("${T}")`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",color:"#2563eb"},children:null})},i=a.story({args:{children:e.jsxs(e.Fragment,{children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}}),p=a.story({args:{...i.input.args,direction:"column"}}),c=a.story({args:{...i.input.args,direction:"row"}}),l=a.story({args:{align:"start",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),d=a.story({args:{align:"start",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),x=a.story({args:{align:"center",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),h=a.story({args:{align:"center",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),g=a.story({args:{align:"end",direction:"column"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),u=a.story({args:{align:"end",direction:"row"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),m=a.story({args:{align:{xs:"start",md:"center",lg:"end"}},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{height:"32px"}),e.jsx(t,{height:"24px"}),e.jsx(t,{height:"48px"})]})}),j=a.story({args:{component:"Box",grow:1,shrink:0,basis:"auto"},argTypes:{component:{control:{type:"select"},options:["Box","Card","Grid","Flex"],mapping:{Box:r=>e.jsx(t,{height:"100%",width:"256px",...r}),Card:r=>e.jsxs(R,{style:{height:"100%",width:"256px"},...r,children:[e.jsx(k,{children:e.jsx(o,{children:"Header"})}),e.jsxs(A,{children:[e.jsx(o,{children:"This is the first paragraph of a long body text that demonstrates how the Card component handles extensive content. The card should adjust accordingly to display all the text properly while maintaining its structure."}),e.jsx(o,{children:"Here's a second paragraph that adds more content to our card body. Having multiple paragraphs helps to visualize how spacing works within the card component."}),e.jsx(o,{children:"This third paragraph continues to add more text to ensure we have a proper demonstration of a card with significant content. This makes it easier to test scrolling behavior and overall layout when content exceeds the initial view."})]}),e.jsx(G,{children:e.jsx(o,{children:"Footer"})})]}),Grid:r=>e.jsxs(s.Root,{...r,height:"128px",style:{width:"256px"},columns:"3",children:[e.jsx(s.Item,{colSpan:"1",rowSpan:"2",children:e.jsx(t,{height:"100%",width:"100%"})}),e.jsx(s.Item,{colSpan:"2",children:e.jsx(t,{height:"100%",width:"100%"})}),e.jsx(s.Item,{colSpan:"2",children:e.jsx(t,{height:"100%",width:"100%"})})]}),Flex:r=>e.jsxs(n,{...r,height:"128px",style:{width:"256px"},justify:"between",children:[e.jsx(t,{height:"100%"}),e.jsx(t,{height:"100%"}),e.jsx(t,{height:"100%"})]})}},grow:{control:"radio",options:[void 0,0,1,!1,!0]},shrink:{control:"radio",options:[void 0,0,1,!1,!0]},basis:{control:"radio",options:[void 0,"0%","25%","50%","100%",100,"250px","auto"]}},render:({component:r,...f})=>e.jsxs(n,{style:{width:"100%",height:"256px"},children:[e.jsx("div",{style:{width:"256px",flex:"1 1 auto",background:"repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)",borderRadius:"12px"}}),e.jsx(r,{...f}),e.jsx("div",{style:{width:"256px",flex:"1 1 auto",background:"repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)",borderRadius:"12px"}})]})}),v=a.story({args:{gap:{xs:"4",md:"8",lg:"12"}},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}),y=a.story({args:{gap:"8"},render:r=>e.jsxs(n,{...r,children:[e.jsx(t,{}),e.jsx(t,{}),e.jsx(t,{})]})}),w=a.story({render:()=>e.jsxs(n,{direction:"row",gap:"8",children:[e.jsx(n,{children:e.jsx(o,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})}),e.jsx(n,{children:e.jsx(o,{truncate:!0,children:"A man looks at a painting in a museum and says, “Brothers and sisters I have none, but that man's father is my father's son.” Who is in the painting?"})})]})}),F=a.story({args:{px:"6",py:"4"},render:r=>e.jsxs(n,{align:"center",style:{flexWrap:"wrap"},children:[e.jsx(n,{...r,children:"Default"}),e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 1)"}),e.jsx(b,{bg:"neutral",children:e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 2)"})}),e.jsx(b,{bg:"neutral",children:e.jsx(b,{bg:"neutral",children:e.jsx(n,{bg:"neutral",...r,children:"Neutral (level 3)"})})}),e.jsx(n,{bg:"danger",...r,children:"Danger"}),e.jsx(n,{bg:"warning",...r,children:"Warning"}),e.jsx(n,{bg:"success",...r,children:"Success"})]})}),B=a.story({args:{px:"6",py:"4",gap:"4"},render:r=>e.jsxs(n,{direction:"column",children:[e.jsx("div",{style:{maxWidth:"600px",marginBottom:"16px"},children:'Using bg="neutral" on Flex auto-increments from the parent context. The first Flex defaults to neutral-1 (no parent), then each nested Flex increments by one, capping at neutral-3.'}),e.jsxs(n,{...r,bg:"neutral",direction:"column",children:[e.jsx("div",{children:"Neutral 1 (no parent)"}),e.jsxs(n,{...r,bg:"neutral",direction:"column",children:[e.jsx("div",{children:"Neutral 2 (auto-incremented)"}),e.jsx(n,{...r,bg:"neutral",direction:"column",children:e.jsx("div",{children:"Neutral 3 (auto-incremented, capped)"})})]})]})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </>
  }
})`,...i.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'column'
  }
})`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    ...Default.input.args,
    direction: 'row'
  }
})`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'start',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'column'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...x.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    align: 'center',
    direction: 'row'
  },
  render: args => <Flex {...args}>
      <DecorativeBox height="32px" />
      <DecorativeBox height="24px" />
      <DecorativeBox height="48px" />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    component: 'Box',
    grow: 1,
    shrink: 0,
    basis: 'auto'
  },
  argTypes: {
    component: {
      control: {
        type: 'select'
      },
      options: ['Box', 'Card', 'Grid', 'Flex'],
      mapping: {
        Box: props => <DecorativeBox height="100%" width="256px" {...props} />,
        Card: props => <Card style={{
          height: '100%',
          width: '256px'
        }} {...props}>
            <CardHeader>
              <Text>Header</Text>
            </CardHeader>
            <CardBody>
              <Text>
                This is the first paragraph of a long body text that
                demonstrates how the Card component handles extensive content.
                The card should adjust accordingly to display all the text
                properly while maintaining its structure.
              </Text>
              <Text>
                Here's a second paragraph that adds more content to our card
                body. Having multiple paragraphs helps to visualize how spacing
                works within the card component.
              </Text>
              <Text>
                This third paragraph continues to add more text to ensure we
                have a proper demonstration of a card with significant content.
                This makes it easier to test scrolling behavior and overall
                layout when content exceeds the initial view.
              </Text>
            </CardBody>
            <CardFooter>
              <Text>Footer</Text>
            </CardFooter>
          </Card>,
        Grid: props => <Grid.Root {...props} height="128px" style={{
          width: '256px'
        }} columns="3">
            <Grid.Item colSpan="1" rowSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
            <Grid.Item colSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
            <Grid.Item colSpan="2">
              <DecorativeBox height="100%" width="100%" />
            </Grid.Item>
          </Grid.Root>,
        Flex: props => <Flex {...props} height="128px" style={{
          width: '256px'
        }} justify="between">
            <DecorativeBox height="100%" />
            <DecorativeBox height="100%" />
            <DecorativeBox height="100%" />
          </Flex>
      }
    },
    grow: {
      control: 'radio',
      options: [undefined, 0, 1, false, true]
    },
    shrink: {
      control: 'radio',
      options: [undefined, 0, 1, false, true]
    },
    basis: {
      control: 'radio',
      options: [undefined, '0%', '25%', '50%', '100%', 100, '250px', 'auto']
    }
  },
  render: ({
    component: Component,
    ...args
  }) => {
    return <Flex style={{
      width: '100%',
      height: '256px'
    }}>
        <div style={{
        width: '256px',
        flex: '1 1 auto',
        background: 'repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)',
        borderRadius: '12px'
      }} />

        <Component {...args} />

        <div style={{
        width: '256px',
        flex: '1 1 auto',
        background: 'repeating-linear-gradient(-45deg, transparent 0px, transparent 5px, #e8e8e8 5px, #e8e8e8 10px)',
        borderRadius: '12px'
      }} />
      </Flex>;
  }
})`,...j.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    gap: '8'
  },
  render: args => <Flex {...args}>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Flex>
})`,...y.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...w.input.parameters?.docs?.source}}};F.input.parameters={...F.input.parameters,docs:{...F.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...F.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};const oe=["Default","ColumnDirection","RowDirection","AlignStartInColumn","AlignStartInRow","AlignCenterInColumn","AlignCenterInRow","AlignEndInColumn","AlignEndInRow","ResponsiveAlign","FlexItems","ResponsiveGap","LargeGap","WithTextTruncate","Backgrounds","BgNeutral"];export{x as AlignCenterInColumn,h as AlignCenterInRow,g as AlignEndInColumn,u as AlignEndInRow,l as AlignStartInColumn,d as AlignStartInRow,F as Backgrounds,B as BgNeutral,p as ColumnDirection,i as Default,j as FlexItems,y as LargeGap,m as ResponsiveAlign,v as ResponsiveGap,c as RowDirection,w as WithTextTruncate,oe as __namedExportsOrder};
