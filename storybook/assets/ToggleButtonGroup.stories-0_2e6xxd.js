import{ap as F,r as h,am as K,j as e,p as w,B as S}from"./iframe-ByBrTvma.js";import{$ as D,T as t}from"./ToggleButton-DLJiQwrc.js";import{T as j,e as R,q as y,r as f}from"./index-sd8Ux2S-.js";import{F as i}from"./Flex-h9vrKGEc.js";import{T as m}from"./Text-UqpB-ZNE.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-DVPuoPwD.js";import"./useObjectRef--wNNAN9F.js";import"./SelectionIndicator-DKTTljg0.js";import"./useFocusable-DKgeWWm7.js";import"./useControlledState-ZHat3JP6.js";import"./useButton-CAemNEM7.js";import"./usePress-DLYRbVvc.js";import"./context-qznSNLgf.js";import"./useToggleState-DTIGogL0.js";import"./useFocusRing-GE4j_eMP.js";const C={"bui-ToggleButtonGroup":"_bui-ToggleButtonGroup_fkbzp_20"},E=F()({styles:C,classNames:{root:"bui-ToggleButtonGroup"},propDefs:{className:{},children:{}}}),o=h.forwardRef((n,x)=>{const{ownProps:G,restProps:O}=K(E,n),{classes:b,children:M}=G;return e.jsx(D,{className:b.root,ref:x,...O,children:M})});o.displayName="ToggleButtonGroup";o.__docgenInfo={description:"@public",methods:[],displayName:"ToggleButtonGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const l=w.meta({title:"Backstage UI/ToggleButtonGroup",component:o,argTypes:{selectionMode:{control:"select",options:["single","multiple"]},orientation:{control:"select",options:["horizontal","vertical"]}}}),r=l.story({args:{selectionMode:"single",defaultSelectedKeys:["dogs"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"dogs",children:"Dogs"}),e.jsx(t,{id:"cats",children:"Cats"}),e.jsx(t,{id:"birds",children:"Birds"})]})}),s=l.story({args:{selectionMode:"multiple",defaultSelectedKeys:["frontend"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"frontend",children:"Frontend"}),e.jsx(t,{id:"backend",children:"Backend"}),e.jsx(t,{id:"platform",children:"Platform"})]})}),g=l.story({args:{selectionMode:"single",defaultSelectedKeys:["option1"]},parameters:{argTypes:{selectionMode:{control:!1}}},render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"Default"}),e.jsx(i,{align:"center",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Neutral 1"}),e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Neutral 2"}),e.jsx(S,{bg:"neutral",children:e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Neutral 3"}),e.jsx(S,{bg:"neutral",children:e.jsx(S,{bg:"neutral",children:e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})})})]})]})}),u=l.story({args:{selectionMode:"single",isDisabled:!0},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"cat",children:"Cat"}),e.jsx(t,{id:"dog",children:"Dog"}),e.jsx(t,{id:"bird",children:"Bird"})]})}),d=l.story({args:{selectionMode:"single",disallowEmptySelection:!0,defaultSelectedKeys:["one"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"one",children:"One"}),e.jsx(t,{id:"two",children:"Two"}),e.jsx(t,{id:"three",children:"Three"})]})}),a=l.story({render:()=>e.jsxs(o,{selectionMode:"single",children:[e.jsx(t,{id:"one",children:"One"}),e.jsx(t,{id:"two",isDisabled:!0,children:"Two"}),e.jsx(t,{id:"three",children:"Three"})]})}),c=l.story({args:{orientation:"vertical"},render:n=>e.jsxs(o,{...n,selectionMode:"single",children:[e.jsx(t,{id:"morning",children:"Morning"}),e.jsx(t,{id:"afternoon",children:"Afternoon"}),e.jsx(t,{id:"evening",children:"Evening"})]})}),p=l.story({render:()=>{const[n,x]=h.useState(new Set(["beta"]));return e.jsxs(i,{direction:"column",gap:"3",children:[e.jsxs(o,{selectionMode:"single",selectedKeys:n,onSelectionChange:x,children:[e.jsx(t,{id:"alpha",children:"Alpha"}),e.jsx(t,{id:"beta",children:"Beta"}),e.jsx(t,{id:"gamma",children:"Gamma"})]}),e.jsxs(m,{children:["Selected: ",[...n].join(", ")||"none"]})]})}}),T=l.story({args:{selectionMode:"single"},render:()=>e.jsxs(o,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(t,{id:"cloud","aria-label":"Cloud",iconStart:e.jsx(j,{})}),e.jsx(t,{id:"starred","aria-label":"Starred",iconStart:e.jsx(R,{})}),e.jsx(t,{id:"star",iconStart:e.jsx(y,{}),children:"Star"}),e.jsx(t,{id:"next",iconEnd:e.jsx(f,{}),children:"Next"})]})}),B=l.story({render:()=>e.jsxs(o,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(t,{id:"cloud",iconStart:e.jsx(j,{})}),e.jsx(t,{id:"star",iconStart:e.jsx(y,{})}),e.jsx(t,{id:"next",iconEnd:e.jsx(f,{})})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const SingleSelection = () => (
  <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={["dogs"]}>
    <ToggleButton id="dogs">Dogs</ToggleButton>
    <ToggleButton id="cats">Cats</ToggleButton>
    <ToggleButton id="birds">Birds</ToggleButton>
  </ToggleButtonGroup>
);
`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const MultipleSelection = () => (
  <ToggleButtonGroup
    selectionMode="multiple"
    defaultSelectedKeys={["frontend"]}
  >
    <ToggleButton id="frontend">Frontend</ToggleButton>
    <ToggleButton id="backend">Backend</ToggleButton>
    <ToggleButton id="platform">Platform</ToggleButton>
  </ToggleButtonGroup>
);
`,...s.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const Backgrounds = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default</Text>
      <Flex align="center" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={["option1"]}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 1</Text>
      <Flex align="center" bg="neutral" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={["option1"]}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 2</Text>
      <Box bg="neutral">
        <Flex align="center" bg="neutral" p="4" gap="4">
          <ToggleButtonGroup
            selectionMode="single"
            defaultSelectedKeys={["option1"]}
          >
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Box>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 3</Text>
      <Box bg="neutral">
        <Box bg="neutral">
          <Flex align="center" bg="neutral" p="4" gap="4">
            <ToggleButtonGroup
              selectionMode="single"
              defaultSelectedKeys={["option1"]}
            >
              <ToggleButton id="option1">Option 1</ToggleButton>
              <ToggleButton id="option2">Option 2</ToggleButton>
              <ToggleButton id="option3">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </Flex>
        </Box>
      </Box>
    </Flex>
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const DisabledGroup = () => (
  <ToggleButtonGroup selectionMode="single" isDisabled>
    <ToggleButton id="cat">Cat</ToggleButton>
    <ToggleButton id="dog">Dog</ToggleButton>
    <ToggleButton id="bird">Bird</ToggleButton>
  </ToggleButtonGroup>
);
`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const DisallowEmptySelection = () => (
  <ToggleButtonGroup
    selectionMode="single"
    disallowEmptySelection
    defaultSelectedKeys={["one"]}
  >
    <ToggleButton id="one">One</ToggleButton>
    <ToggleButton id="two">Two</ToggleButton>
    <ToggleButton id="three">Three</ToggleButton>
  </ToggleButtonGroup>
);
`,...d.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const MixedDisabled = () => (
  <ToggleButtonGroup selectionMode="single">
    <ToggleButton id="one">One</ToggleButton>
    <ToggleButton id="two" isDisabled>
      Two
    </ToggleButton>
    <ToggleButton id="three">Three</ToggleButton>
  </ToggleButtonGroup>
);
`,...a.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Orientation = () => (
  <ToggleButtonGroup orientation="vertical" selectionMode="single">
    <ToggleButton id="morning">Morning</ToggleButton>
    <ToggleButton id="afternoon">Afternoon</ToggleButton>
    <ToggleButton id="evening">Evening</ToggleButton>
  </ToggleButtonGroup>
);
`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const ControlledGroup = () => {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set(["beta"])
  );

  return (
    <Flex direction="column" gap="3">
      <ToggleButtonGroup
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <ToggleButton id="alpha">Alpha</ToggleButton>
        <ToggleButton id="beta">Beta</ToggleButton>
        <ToggleButton id="gamma">Gamma</ToggleButton>
      </ToggleButtonGroup>
      <Text>Selected: {[...selectedKeys].join(", ") || "none"}</Text>
    </Flex>
  );
};
`,...p.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const WithIcons = () => (
  <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={["cloud"]}>
    <ToggleButton id="cloud" aria-label="Cloud" iconStart={<RiCloudLine />} />
    <ToggleButton
      id="starred"
      aria-label="Starred"
      iconStart={<RiStarFill />}
    />
    <ToggleButton id="star" iconStart={<RiStarLine />}>
      Star
    </ToggleButton>
    <ToggleButton id="next" iconEnd={<RiArrowRightSLine />}>
      Next
    </ToggleButton>
  </ToggleButtonGroup>
);
`,...T.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{code:`const IconsOnly = () => (
  <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={["cloud"]}>
    <ToggleButton id="cloud" iconStart={<RiCloudLine />} />
    <ToggleButton id="star" iconStart={<RiStarLine />} />
    <ToggleButton id="next" iconEnd={<RiArrowRightSLine />} />
  </ToggleButtonGroup>
);
`,...B.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['dogs']
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="dogs">Dogs</ToggleButton>
      <ToggleButton id="cats">Cats</ToggleButton>
      <ToggleButton id="birds">Birds</ToggleButton>
    </ToggleButtonGroup>
})`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'multiple',
    defaultSelectedKeys: ['frontend']
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="frontend">Frontend</ToggleButton>
      <ToggleButton id="backend">Backend</ToggleButton>
      <ToggleButton id="platform">Platform</ToggleButton>
    </ToggleButtonGroup>
})`,...s.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['option1']
  },
  parameters: {
    argTypes: {
      selectionMode: {
        control: false
      }
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 1</Text>
        <Flex align="center" bg="neutral" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 2</Text>
        <Box bg="neutral">
          <Flex align="center" bg="neutral" p="4" gap="4">
            <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
              <ToggleButton id="option1">Option 1</ToggleButton>
              <ToggleButton id="option2">Option 2</ToggleButton>
              <ToggleButton id="option3">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </Flex>
        </Box>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 3</Text>
        <Box bg="neutral">
          <Box bg="neutral">
            <Flex align="center" bg="neutral" p="4" gap="4">
              <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
                <ToggleButton id="option1">Option 1</ToggleButton>
                <ToggleButton id="option2">Option 2</ToggleButton>
                <ToggleButton id="option3">Option 3</ToggleButton>
              </ToggleButtonGroup>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    isDisabled: true
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="cat">Cat</ToggleButton>
      <ToggleButton id="dog">Dog</ToggleButton>
      <ToggleButton id="bird">Bird</ToggleButton>
    </ToggleButtonGroup>
})`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    disallowEmptySelection: true,
    defaultSelectedKeys: ['one']
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="one">One</ToggleButton>
      <ToggleButton id="two">Two</ToggleButton>
      <ToggleButton id="three">Three</ToggleButton>
    </ToggleButtonGroup>
})`,...d.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ToggleButtonGroup selectionMode="single">
      <ToggleButton id="one">One</ToggleButton>
      <ToggleButton id="two" isDisabled>
        Two
      </ToggleButton>
      <ToggleButton id="three">Three</ToggleButton>
    </ToggleButtonGroup>
})`,...a.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    orientation: 'vertical'
  },
  render: args => <ToggleButtonGroup {...args} selectionMode="single">
      <ToggleButton id="morning">Morning</ToggleButton>
      <ToggleButton id="afternoon">Afternoon</ToggleButton>
      <ToggleButton id="evening">Evening</ToggleButton>
    </ToggleButtonGroup>
})`,...c.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['beta']));
    return <Flex direction="column" gap="3">
        <ToggleButtonGroup selectionMode="single" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
          <ToggleButton id="alpha">Alpha</ToggleButton>
          <ToggleButton id="beta">Beta</ToggleButton>
          <ToggleButton id="gamma">Gamma</ToggleButton>
        </ToggleButtonGroup>
        <Text>Selected: {[...selectedKeys].join(', ') || 'none'}</Text>
      </Flex>;
  }
})`,...p.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single'
  },
  render: () => <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" aria-label="Cloud" iconStart={<RiCloudLine />} />
      <ToggleButton id="starred" aria-label="Starred" iconStart={<RiStarFill />} />
      <ToggleButton id="star" iconStart={<RiStarLine />}>
        Star
      </ToggleButton>
      <ToggleButton id="next" iconEnd={<RiArrowRightSLine />}>
        Next
      </ToggleButton>
    </ToggleButtonGroup>
})`,...T.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" iconStart={<RiCloudLine />} />
      <ToggleButton id="star" iconStart={<RiStarLine />} />
      <ToggleButton id="next" iconEnd={<RiArrowRightSLine />} />
    </ToggleButtonGroup>
})`,...B.input.parameters?.docs?.source}}};const V=["SingleSelection","MultipleSelection","Backgrounds","DisabledGroup","DisallowEmptySelection","MixedDisabled","Orientation","ControlledGroup","WithIcons","IconsOnly"];export{g as Backgrounds,p as ControlledGroup,u as DisabledGroup,d as DisallowEmptySelection,B as IconsOnly,a as MixedDisabled,s as MultipleSelection,c as Orientation,r as SingleSelection,T as WithIcons,V as __namedExportsOrder};
