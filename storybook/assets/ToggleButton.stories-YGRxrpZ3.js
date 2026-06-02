import{bR as e,i as b,ca as f,c7 as E}from"./iframe-DogXi1kP.js";import{T as t}from"./ToggleButton-BIgSH1RH.js";import{a as T,D as j,T as y,F as D,H as B}from"./index-RV6Ph9vd.js";import{F as r}from"./Flex-Bi-SKTgz.js";import{T as s}from"./Text-BbRcKCRf.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-AxfqVSE9.js";import"./useObjectRef-UHrM_yCs.js";import"./FocusScope-C_GT869N.js";import"./useFocusRing-mENG_ikp.js";import"./openLink-CxuZpafj.js";import"./useButton-C2CjCUzA.js";import"./usePress-PepYZ5yJ.js";import"./textSelection-QdGxsqrV.js";import"./I18nProvider-Cag9fozJ.js";import"./useControlledState-CrzRLYRc.js";import"./useToggleState-D-PVak1T.js";import"./useHover-ox9S2Piy.js";const a=E.meta({title:"Backstage UI/ToggleButton",component:t,argTypes:{size:{control:"select",options:["small","medium"]}}}),i=a.story({args:{children:"Toggle"}}),c=a.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(r,{direction:"column",gap:"4",children:[e.jsxs(r,{direction:"column",gap:"4",children:[e.jsx(s,{children:"Default"}),e.jsx(r,{align:"center",p:"4",children:e.jsx(t,{children:"Toggle"})})]}),e.jsxs(r,{direction:"column",gap:"4",children:[e.jsx(s,{children:"On Neutral 1"}),e.jsx(r,{align:"center",bg:"neutral",p:"4",children:e.jsx(t,{children:"Toggle"})})]}),e.jsxs(r,{direction:"column",gap:"4",children:[e.jsx(s,{children:"On Neutral 2"}),e.jsx(b,{bg:"neutral",children:e.jsx(r,{align:"center",bg:"neutral",p:"4",children:e.jsx(t,{children:"Toggle"})})})]}),e.jsxs(r,{direction:"column",gap:"4",children:[e.jsx(s,{children:"On Neutral 3"}),e.jsx(b,{bg:"neutral",children:e.jsx(b,{bg:"neutral",children:e.jsx(r,{align:"center",bg:"neutral",p:"4",children:e.jsx(t,{children:"Toggle"})})})})]})]})}),d=a.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(r,{align:"center",children:[e.jsx(t,{size:"small",children:"Small"}),e.jsx(t,{size:"medium",children:"Medium"})]})}),g=a.story({args:{children:"Favorite"},render:n=>e.jsxs(r,{align:"center",children:[e.jsx(t,{...n,iconStart:e.jsx(j,{})}),e.jsx(t,{...n,iconStart:e.jsx(T,{}),defaultSelected:!0}),e.jsx(t,{...n,iconEnd:e.jsx(B,{})}),e.jsx(t,{iconEnd:e.jsx(B,{})})]})}),u=a.story({render:()=>e.jsxs(r,{align:"center",children:[e.jsx(t,{"aria-label":"Cloud",iconStart:e.jsx(y,{})}),e.jsx(t,{"aria-label":"Starred",defaultSelected:!0,iconStart:e.jsx(T,{})}),e.jsx(t,{"aria-label":"Next",iconStart:e.jsx(D,{})})]})}),p=a.story({render:()=>e.jsxs(r,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(y,{}),children:"Cloud"}),e.jsx(t,{iconStart:e.jsx(j,{}),children:"Star"}),e.jsx(t,{iconEnd:e.jsx(D,{}),children:"Next"})]})}),x=a.story({render:()=>e.jsxs(r,{align:"center",children:[e.jsx(t,{isDisabled:!0,children:"Disabled"}),e.jsx(t,{defaultSelected:!0,isDisabled:!0,children:"Selected"})]})}),m=a.story({render:()=>{const[n,o]=f.useState(!1);return e.jsxs(r,{direction:"column",gap:"3",children:[e.jsx(t,{"aria-label":"Star",isSelected:n,onChange:o,iconStart:n?e.jsx(T,{}):e.jsx(j,{}),children:n?"Starred":"Not starred"}),e.jsxs(s,{children:["State: ",n?"selected":"unselected"]})]})}}),h=a.story({render:()=>{const[n,o]=f.useState(!1);return e.jsxs(r,{direction:"column",gap:"3",children:[e.jsxs(r,{align:"center",gap:"2",children:[e.jsx(t,{isDisabled:n,children:({isDisabled:l,isSelected:F})=>l?`Disabled ${F?"(Selected)":"(Unselected)"}`:`Enabled ${F?"(Selected)":"(Unselected)"}`}),e.jsx(t,{"aria-label":"Toggle disabled state",onChange:()=>o(!n),children:n?"Enable":"Disable"})]}),e.jsx(s,{children:"Toggle the button to change the disabled state and see text update"})]})}}),S=a.story({render:()=>e.jsxs(r,{direction:"column",gap:"4",children:[e.jsxs(r,{direction:"column",gap:"2",children:[e.jsx(s,{weight:"bold",children:"Example 1: Selection State"}),e.jsxs(r,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:n})=>n?"✓ Selected":"Not Selected"}),e.jsx(t,{children:({isSelected:n})=>n?"✓ Selected":"Not Selected"})]})]}),e.jsxs(r,{direction:"column",gap:"2",children:[e.jsx(s,{weight:"bold",children:"Example 2: Multiple States"}),e.jsxs(r,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:n,isHovered:o})=>{const l=[];return n?l.push("on"):l.push("off"),o&&l.push("hovered"),`Email (${l.join(", ")})`}}),e.jsx(t,{children:({isSelected:n,isHovered:o})=>{const l=[];return n?l.push("on"):l.push("off"),o&&l.push("hovered"),`Push (${l.join(", ")})`}})]})]}),e.jsxs(r,{direction:"column",gap:"2",children:[e.jsx(s,{weight:"bold",children:"Example 3: Conditional Icons"}),e.jsx(r,{align:"center",gap:"2",children:e.jsx(t,{children:({isSelected:n})=>e.jsxs(e.Fragment,{children:[n?e.jsx(T,{}):e.jsx(j,{}),e.jsx("span",{children:n?"Starred":"Star"})]})})})]}),e.jsxs(r,{direction:"column",gap:"2",children:[e.jsx(s,{weight:"bold",children:"Example 4: Status Indicators"}),e.jsxs(r,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:n})=>e.jsxs(r,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:n?"var(--bui-fg-success)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Active"})]})}),e.jsx(t,{children:({isSelected:n})=>e.jsxs(r,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:n?"var(--bui-fg-danger)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Inactive"})]})})]})]})]})});i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Toggle'
  }
})`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Toggle'
  },
  parameters: {
    argTypes: {
      size: {
        control: false
      }
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex align="center" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 1</Text>
        <Flex align="center" bg="neutral" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 2</Text>
        <Box bg="neutral">
          <Flex align="center" bg="neutral" p="4">
            <ToggleButton>Toggle</ToggleButton>
          </Flex>
        </Box>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 3</Text>
        <Box bg="neutral">
          <Box bg="neutral">
            <Flex align="center" bg="neutral" p="4">
              <ToggleButton>Toggle</ToggleButton>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Toggle'
  },
  parameters: {
    argTypes: {
      size: {
        control: false
      }
    }
  },
  render: () => <Flex align="center">
      <ToggleButton size="small">Small</ToggleButton>
      <ToggleButton size="medium">Medium</ToggleButton>
    </Flex>
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Favorite'
  },
  render: args => <Flex align="center">
      <ToggleButton {...args} iconStart={<RiStarLine />} />
      <ToggleButton {...args} iconStart={<RiStarFill />} defaultSelected />
      <ToggleButton {...args} iconEnd={<RiCheckLine />} />
      <ToggleButton iconEnd={<RiCheckLine />} />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton aria-label="Cloud" iconStart={<RiCloudLine />} />
      <ToggleButton aria-label="Starred" defaultSelected iconStart={<RiStarFill />} />
      <ToggleButton aria-label="Next" iconStart={<RiArrowRightSLine />} />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton iconStart={<RiCloudLine />}>Cloud</ToggleButton>
      <ToggleButton iconStart={<RiStarLine />}>Star</ToggleButton>
      <ToggleButton iconEnd={<RiArrowRightSLine />}>Next</ToggleButton>
    </Flex>
})`,...p.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton isDisabled>Disabled</ToggleButton>
      <ToggleButton defaultSelected isDisabled>
        Selected
      </ToggleButton>
    </Flex>
})`,...x.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [selected, setSelected] = useState(false);
    return <Flex direction="column" gap="3">
        <ToggleButton aria-label="Star" isSelected={selected} onChange={setSelected} iconStart={selected ? <RiStarFill /> : <RiStarLine />}>
          {selected ? 'Starred' : 'Not starred'}
        </ToggleButton>
        <Text>State: {selected ? 'selected' : 'unselected'}</Text>
      </Flex>;
  }
})`,...m.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [disabled, setDisabled] = useState(false);
    return <Flex direction="column" gap="3">
        <Flex align="center" gap="2">
          <ToggleButton isDisabled={disabled}>
            {({
            isDisabled,
            isSelected
          }) => isDisabled ? \`Disabled \${isSelected ? '(Selected)' : '(Unselected)'}\` : \`Enabled \${isSelected ? '(Selected)' : '(Unselected)'}\`}
          </ToggleButton>
          <ToggleButton aria-label="Toggle disabled state" onChange={() => setDisabled(!disabled)}>
            {disabled ? 'Enable' : 'Disable'}
          </ToggleButton>
        </Flex>
        <Text>
          Toggle the button to change the disabled state and see text update
        </Text>
      </Flex>;
  }
})`,...h.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    return <Flex direction="column" gap="4">
        <Flex direction="column" gap="2">
          <Text weight="bold">Example 1: Selection State</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({
              isSelected
            }) => isSelected ? '✓ Selected' : 'Not Selected'}
            </ToggleButton>
            <ToggleButton>
              {({
              isSelected
            }) => isSelected ? '✓ Selected' : 'Not Selected'}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 2: Multiple States</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({
              isSelected,
              isHovered
            }) => {
              const states = [];
              if (isSelected) states.push('on');else states.push('off');
              if (isHovered) states.push('hovered');
              return \`Email (\${states.join(', ')})\`;
            }}
            </ToggleButton>
            <ToggleButton>
              {({
              isSelected,
              isHovered
            }) => {
              const states = [];
              if (isSelected) states.push('on');else states.push('off');
              if (isHovered) states.push('hovered');
              return \`Push (\${states.join(', ')})\`;
            }}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 3: Conditional Icons</Text>
          <Flex align="center" gap="2">
            <ToggleButton>
              {({
              isSelected
            }) => <>
                  {isSelected ? <RiStarFill /> : <RiStarLine />}
                  <span>{isSelected ? 'Starred' : 'Star'}</span>
                </>}
            </ToggleButton>
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text weight="bold">Example 4: Status Indicators</Text>
          <Flex align="center" gap="2">
            <ToggleButton defaultSelected>
              {({
              isSelected
            }) => <Flex align="center" gap="2">
                  <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isSelected ? 'var(--bui-fg-success)' : 'var(--bui-fg-secondary)'
              }} />
                  <span>Active</span>
                </Flex>}
            </ToggleButton>
            <ToggleButton>
              {({
              isSelected
            }) => <Flex align="center" gap="2">
                  <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isSelected ? 'var(--bui-fg-danger)' : 'var(--bui-fg-secondary)'
              }} />
                  <span>Inactive</span>
                </Flex>}
            </ToggleButton>
          </Flex>
        </Flex>
      </Flex>;
  }
})`,...S.input.parameters?.docs?.source}}};const q=["Default","Backgrounds","Sizes","WithIcons","IconsOnly","IconsAndText","Disabled","Controlled","FunctionChildren","DynamicContent"];export{c as Backgrounds,m as Controlled,i as Default,x as Disabled,S as DynamicContent,h as FunctionChildren,p as IconsAndText,u as IconsOnly,d as Sizes,g as WithIcons,q as __namedExportsOrder};
