import{bg as K,ca as j,cH as F,bR as e,i as h,c7 as w}from"./iframe-DogXi1kP.js";import{$ as D,T as t}from"./ToggleButton-BIgSH1RH.js";import{T as S,D as y,F as f,a as E}from"./index-RV6Ph9vd.js";import{F as i}from"./Flex-Bi-SKTgz.js";import{T as l}from"./Text-BbRcKCRf.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./FocusScope-C_GT869N.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useButton-C2CjCUzA.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./I18nProvider-Cag9fozJ.js";import"./useControlledState-CrzRLYRc.js";import"./useToggleState-D-PVak1T.js";import"./useHover-ox9S2Piy.js";const N={"bui-ToggleButtonGroup":"_bui-ToggleButtonGroup_6u2sw_20"},C=K()({styles:N,classNames:{root:"bui-ToggleButtonGroup"},propDefs:{className:{},children:{}}}),o=j.forwardRef((n,B)=>{const{ownProps:b,restProps:G}=F(C,n),{classes:O,children:M}=b;return e.jsx(D,{className:O.root,ref:B,...G,children:M})});o.displayName="ToggleButtonGroup";o.__docgenInfo={description:`A container that groups ToggleButton items and manages their collective selection state.

@public`,methods:[],displayName:"ToggleButtonGroup",props:{className:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const r=w.meta({title:"Backstage UI/ToggleButtonGroup",component:o,argTypes:{selectionMode:{control:"select",options:["single","multiple"]},orientation:{control:"select",options:["horizontal","vertical"]}}}),s=r.story({args:{selectionMode:"single",defaultSelectedKeys:["dogs"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"dogs",children:"Dogs"}),e.jsx(t,{id:"cats",children:"Cats"}),e.jsx(t,{id:"birds",children:"Birds"})]})}),d=r.story({args:{selectionMode:"multiple",defaultSelectedKeys:["frontend"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"frontend",children:"Frontend"}),e.jsx(t,{id:"backend",children:"Backend"}),e.jsx(t,{id:"platform",children:"Platform"})]})}),g=r.story({args:{selectionMode:"single",defaultSelectedKeys:["option1"]},parameters:{argTypes:{selectionMode:{control:!1}}},render:()=>e.jsxs(i,{direction:"column",gap:"4",children:[e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(l,{children:"Default"}),e.jsx(i,{align:"center",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Neutral 1"}),e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Neutral 2"}),e.jsx(h,{bg:"neutral",children:e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})})]}),e.jsxs(i,{direction:"column",gap:"4",children:[e.jsx(l,{children:"On Neutral 3"}),e.jsx(h,{bg:"neutral",children:e.jsx(h,{bg:"neutral",children:e.jsx(i,{align:"center",bg:"neutral",p:"4",gap:"4",children:e.jsxs(o,{selectionMode:"single",defaultSelectedKeys:["option1"],children:[e.jsx(t,{id:"option1",children:"Option 1"}),e.jsx(t,{id:"option2",children:"Option 2"}),e.jsx(t,{id:"option3",children:"Option 3"})]})})})})]})]})}),a=r.story({args:{selectionMode:"single",isDisabled:!0},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"cat",children:"Cat"}),e.jsx(t,{id:"dog",children:"Dog"}),e.jsx(t,{id:"bird",children:"Bird"})]})}),c=r.story({args:{selectionMode:"single",disallowEmptySelection:!0,defaultSelectedKeys:["one"]},render:n=>e.jsxs(o,{...n,children:[e.jsx(t,{id:"one",children:"One"}),e.jsx(t,{id:"two",children:"Two"}),e.jsx(t,{id:"three",children:"Three"})]})}),u=r.story({render:()=>e.jsxs(o,{selectionMode:"single",children:[e.jsx(t,{id:"one",children:"One"}),e.jsx(t,{id:"two",isDisabled:!0,children:"Two"}),e.jsx(t,{id:"three",children:"Three"})]})}),p=r.story({args:{orientation:"vertical"},render:n=>e.jsxs(o,{...n,selectionMode:"single",children:[e.jsx(t,{id:"morning",children:"Morning"}),e.jsx(t,{id:"afternoon",children:"Afternoon"}),e.jsx(t,{id:"evening",children:"Evening"})]})}),T=r.story({render:()=>{const[n,B]=j.useState(new Set(["beta"]));return e.jsxs(i,{direction:"column",gap:"3",children:[e.jsxs(o,{selectionMode:"single",selectedKeys:n,onSelectionChange:B,children:[e.jsx(t,{id:"alpha",children:"Alpha"}),e.jsx(t,{id:"beta",children:"Beta"}),e.jsx(t,{id:"gamma",children:"Gamma"})]}),e.jsxs(l,{children:["Selected: ",[...n].join(", ")||"none"]})]})}}),x=r.story({args:{selectionMode:"single"},render:()=>e.jsxs(o,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(t,{id:"cloud","aria-label":"Cloud",iconStart:e.jsx(S,{})}),e.jsx(t,{id:"starred","aria-label":"Starred",iconStart:e.jsx(E,{})}),e.jsx(t,{id:"star",iconStart:e.jsx(y,{}),children:"Star"}),e.jsx(t,{id:"next",iconEnd:e.jsx(f,{}),children:"Next"})]})}),m=r.story({render:()=>e.jsxs(o,{selectionMode:"multiple",defaultSelectedKeys:["cloud"],children:[e.jsx(t,{id:"cloud",iconStart:e.jsx(S,{})}),e.jsx(t,{id:"star",iconStart:e.jsx(y,{})}),e.jsx(t,{id:"next",iconEnd:e.jsx(f,{})})]})});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    defaultSelectedKeys: ['dogs']
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="dogs">Dogs</ToggleButton>
      <ToggleButton id="cats">Cats</ToggleButton>
      <ToggleButton id="birds">Birds</ToggleButton>
    </ToggleButtonGroup>
})`,...s.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'multiple',
    defaultSelectedKeys: ['frontend']
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="frontend">Frontend</ToggleButton>
      <ToggleButton id="backend">Backend</ToggleButton>
      <ToggleButton id="platform">Platform</ToggleButton>
    </ToggleButtonGroup>
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    selectionMode: 'single',
    isDisabled: true
  },
  render: args => <ToggleButtonGroup {...args}>
      <ToggleButton id="cat">Cat</ToggleButton>
      <ToggleButton id="dog">Dog</ToggleButton>
      <ToggleButton id="bird">Bird</ToggleButton>
    </ToggleButtonGroup>
})`,...a.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ToggleButtonGroup selectionMode="single">
      <ToggleButton id="one">One</ToggleButton>
      <ToggleButton id="two" isDisabled>
        Two
      </ToggleButton>
      <ToggleButton id="three">Three</ToggleButton>
    </ToggleButtonGroup>
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    orientation: 'vertical'
  },
  render: args => <ToggleButtonGroup {...args} selectionMode="single">
      <ToggleButton id="morning">Morning</ToggleButton>
      <ToggleButton id="afternoon">Afternoon</ToggleButton>
      <ToggleButton id="evening">Evening</ToggleButton>
    </ToggleButtonGroup>
})`,...p.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
      <ToggleButton id="cloud" iconStart={<RiCloudLine />} />
      <ToggleButton id="star" iconStart={<RiStarLine />} />
      <ToggleButton id="next" iconEnd={<RiArrowRightSLine />} />
    </ToggleButtonGroup>
})`,...m.input.parameters?.docs?.source}}};const Y=["SingleSelection","MultipleSelection","Backgrounds","DisabledGroup","DisallowEmptySelection","MixedDisabled","Orientation","ControlledGroup","WithIcons","IconsOnly"];export{g as Backgrounds,T as ControlledGroup,a as DisabledGroup,c as DisallowEmptySelection,m as IconsOnly,u as MixedDisabled,d as MultipleSelection,p as Orientation,s as SingleSelection,x as WithIcons,Y as __namedExportsOrder};
