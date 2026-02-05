import{r as h,j as e,p as b}from"./iframe-M9O-K8SB.js";import{c as w}from"./clsx-B-dksMZM.js";import{$ as D,T as o}from"./ToggleButton-Dmyuo9NW.js";import{u as E}from"./useStyles-BRwt6BXn.js";import{T as f,e as R,q as j,r as y}from"./index-BKJKY9Wv.js";import{F as i}from"./Flex-Bz2InqMs.js";import{T as m}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./SelectionIndicator-yhlvspp_.js";import"./useFocusable-BwFERnd_.js";import"./useControlledState-DzBnLbpE.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./context-Bv6kxITJ.js";import"./useToggleState-O3dGrC2P.js";import"./useFocusRing-COnCKKka.js";import"./useSurface-CJaN3YoD.js";const C={classNames:{root:"bui-ToggleButtonGroup"},dataAttributes:{orientation:["horizontal","vertical"]}},A={"bui-ToggleButtonGroup":"_bui-ToggleButtonGroup_bnvku_20"},t=h.forwardRef((n,x)=>{const{classNames:S,dataAttributes:G,cleanedProps:O}=E(C,{...n}),{className:M,children:F,...K}=O;return e.jsx(D,{className:w(S.root,A[S.root],M),ref:x,...G,...K,children:F})});t.displayName="ToggleButtonGroup";t.__docgenInfo={description:"@public",methods:[],displayName:"ToggleButtonGroup",props:{orientation:{required:!1,tsType:{name:"NonNullable",elements:[{name:"AriaToggleButtonGroupProps['orientation']",raw:"AriaToggleButtonGroupProps['orientation']"}],raw:"NonNullable<AriaToggleButtonGroupProps['orientation']>"},description:""}},composes:["Omit"]};const l=b.meta({title:"Backstage UI/ToggleButtonGroup",component:t,argTypes:{selectionMode:{control:"select",options:["single","multiple"]},orientation:{control:"select",options:["horizontal","vertical"]}}}),r=l.story({args:{selectionMode:"single",defaultSelectedKeys:["dogs"]},render:n=>e.jsxs(t,{...n,children:[e.jsx(o,{id:"dogs",children:"Dogs"}),e.jsx(o,{id:"cats",children:"Cats"}),e.jsx(o,{id:"birds",children:"Birds"})]})}),s=l.story({args:{selectionMode:"multiple",defaultSelectedKeys:["frontend"]},render:n=>e.jsxs(t,{...n,children:[e.jsx(o,{id:"frontend",children:"Frontend"}),e.jsx(o,{id:"backend",children:"Backend"}),e.jsx(o,{id:"platform",children:"Platform"})]})}),g=l.story({args:{selectionMode:"single",defaultSelectedKeys:["option1"]},parameters:{argTypes:{selectionMode:{control:!1}}},render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"Default"}),e.jsx(i,{align:"center",p:"4",gap:"4",children:e.jsxs(t,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(o,{id:"option1",children:"Option 1"}),e.jsx(o,{id:"option2",children:"Option 2"}),e.jsx(o,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Surface 0"}),e.jsx(i,{align:"center",surface:"0",p:"4",gap:"4",children:e.jsxs(t,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(o,{id:"option1",children:"Option 1"}),e.jsx(o,{id:"option2",children:"Option 2"}),e.jsx(o,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Surface 1"}),e.jsx(i,{align:"center",surface:"1",p:"4",gap:"4",children:e.jsxs(t,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(o,{id:"option1",children:"Option 1"}),e.jsx(o,{id:"option2",children:"Option 2"}),e.jsx(o,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Surface 2"}),e.jsx(i,{align:"center",surface:"2",p:"4",gap:"4",children:e.jsxs(t,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(o,{id:"option1",children:"Option 1"}),e.jsx(o,{id:"option2",children:"Option 2"}),e.jsx(o,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(m,{children:"On Surface 3"}),e.jsx(i,{align:"center",surface:"3",p:"4",gap:"4",children:e.jsxs(t,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(o,{id:"option1",children:"Option 1"}),e.jsx(o,{id:"option2",children:"Option 2"}),e.jsx(o,{id:"option3",children:"Option 3"})]})})]})]})}),u=l.story({args:{selectionMode:"single",isDisabled:!0},render:n=>e.jsxs(t,{...n,children:[e.jsx(o,{id:"cat",children:"Cat"}),e.jsx(o,{id:"dog",children:"Dog"}),e.jsx(o,{id:"bird",children:"Bird"})]})}),d=l.story({args:{selectionMode:"single",disallowEmptySelection:!0,defaultSelectedKeys:["one"]},render:n=>e.jsxs(t,{...n,children:[e.jsx(o,{id:"one",children:"One"}),e.jsx(o,{id:"two",children:"Two"}),e.jsx(o,{id:"three",children:"Three"})]})}),a=l.story({render:()=>e.jsxs(t,{selectionMode:"single",children:[e.jsx(o,{id:"one",children:"One"}),e.jsx(o,{id:"two",isDisabled:!0,children:"Two"}),e.jsx(o,{id:"three",children:"Three"})]})}),c=l.story({args:{orientation:"vertical"},render:n=>e.jsxs(t,{...n,selectionMode:"single",children:[e.jsx(o,{id:"morning",children:"Morning"}),e.jsx(o,{id:"afternoon",children:"Afternoon"}),e.jsx(o,{id:"evening",children:"Evening"})]})}),p=l.story({render:()=>{const[n,x]=h.useState(new Set(["beta"]));return e.jsxs(i,{direction:"column",gap:"3",children:[e.jsxs(t,{selectionMode:"single",selectedKeys:n,onSelectionChange:x,children:[e.jsx(o,{id:"alpha",children:"Alpha"}),e.jsx(o,{id:"beta",children:"Beta"}),e.jsx(o,{id:"gamma",children:"Gamma"})]}),e.jsxs(m,{children:["Selected: ",[...n].join(", ")||"none"]})]})}}),T=l.story({args:{selectionMode:"single"},render:()=>e.jsxs(t,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(o,{id:"cloud","aria-label":"Cloud",iconStart:e.jsx(f,{})}),e.jsx(o,{id:"starred","aria-label":"Starred",iconStart:e.jsx(R,{})}),e.jsx(o,{id:"star",iconStart:e.jsx(j,{}),children:"Star"}),e.jsx(o,{id:"next",iconEnd:e.jsx(y,{}),children:"Next"})]})}),B=l.story({render:()=>e.jsxs(t,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(o,{id:"cloud",iconStart:e.jsx(f,{})}),e.jsx(o,{id:"star",iconStart:e.jsx(j,{})}),e.jsx(o,{id:"next",iconEnd:e.jsx(y,{})})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const SingleSelection = () => (
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
`,...s.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const Surfaces = () => (
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
      <Text>On Surface 0</Text>
      <Flex align="center" surface="0" p="4" gap="4">
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
      <Text>On Surface 1</Text>
      <Flex align="center" surface="1" p="4" gap="4">
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
      <Text>On Surface 2</Text>
      <Flex align="center" surface="2" p="4" gap="4">
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
      <Text>On Surface 3</Text>
      <Flex align="center" surface="3" p="4" gap="4">
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
        <Text>On Surface 0</Text>
        <Flex align="center" surface="0" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex align="center" surface="1" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex align="center" surface="2" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex align="center" surface="3" p="4" gap="4">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['option1']}>
            <ToggleButton id="option1">Option 1</ToggleButton>
            <ToggleButton id="option2">Option 2</ToggleButton>
            <ToggleButton id="option3">Option 3</ToggleButton>
          </ToggleButtonGroup>
        </Flex>
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
})`,...B.input.parameters?.docs?.source}}};const ee=["SingleSelection","MultipleSelection","Surfaces","DisabledGroup","DisallowEmptySelection","MixedDisabled","Orientation","ControlledGroup","WithIcons","IconsOnly"];export{p as ControlledGroup,u as DisabledGroup,d as DisallowEmptySelection,B as IconsOnly,a as MixedDisabled,s as MultipleSelection,c as Orientation,r as SingleSelection,g as Surfaces,T as WithIcons,ee as __namedExportsOrder};
