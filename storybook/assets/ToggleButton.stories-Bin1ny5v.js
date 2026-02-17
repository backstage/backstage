import{p as D,j as e,r as j}from"./iframe-CIst4AKw.js";import{T as t}from"./ToggleButton-C32s13f1.js";import{q as h,e as F,s as B,T as f,r as y}from"./index-DesjfLhx.js";import{F as n}from"./Flex-DONnbgv1.js";import{T as o}from"./Text-rYKqQgpD.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./utils-B0upEwZU.js";import"./useObjectRef-FrufMZAh.js";import"./SelectionIndicator-CTSc5jZP.js";import"./useFocusable-CGqSJqqw.js";import"./useControlledState-BEWoCYbr.js";import"./useButton-BwuJ_L3M.js";import"./usePress-CkeloCST.js";import"./context-wFrFakpV.js";import"./useToggleState-Cfn73ezU.js";import"./useFocusRing-D2d5tR9g.js";import"./useStyles-07Fon270.js";import"./useBg-55zBmT0q.js";const s=D.meta({title:"Backstage UI/ToggleButton",component:t,argTypes:{size:{control:"select",options:["small","medium"]}}}),a=s.story({args:{children:"Toggle"}}),i=s.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(o,{children:"Default"}),e.jsx(n,{align:"center",p:"4",children:e.jsx(t,{children:"Toggle"})})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Neutral 1"}),e.jsx(n,{align:"center",bg:"neutral-1",p:"4",children:e.jsx(t,{children:"Toggle"})})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Neutral 2"}),e.jsx(n,{align:"center",bg:"neutral-2",p:"4",children:e.jsx(t,{children:"Toggle"})})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Neutral 3"}),e.jsx(n,{align:"center",bg:"neutral-3",p:"4",children:e.jsx(t,{children:"Toggle"})})]})]})}),c=s.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(n,{align:"center",children:[e.jsx(t,{size:"small",children:"Small"}),e.jsx(t,{size:"medium",children:"Medium"})]})}),d=s.story({args:{children:"Favorite"},render:l=>e.jsxs(n,{align:"center",children:[e.jsx(t,{...l,iconStart:e.jsx(h,{})}),e.jsx(t,{...l,iconStart:e.jsx(F,{}),defaultSelected:!0}),e.jsx(t,{...l,iconEnd:e.jsx(B,{})}),e.jsx(t,{iconEnd:e.jsx(B,{})})]})}),g=s.story({render:()=>e.jsxs(n,{align:"center",children:[e.jsx(t,{"aria-label":"Cloud",iconStart:e.jsx(f,{})}),e.jsx(t,{"aria-label":"Starred",defaultSelected:!0,iconStart:e.jsx(F,{})}),e.jsx(t,{"aria-label":"Next",iconStart:e.jsx(y,{})})]})}),u=s.story({render:()=>e.jsxs(n,{align:"center",children:[e.jsx(t,{iconStart:e.jsx(f,{}),children:"Cloud"}),e.jsx(t,{iconStart:e.jsx(h,{}),children:"Star"}),e.jsx(t,{iconEnd:e.jsx(y,{}),children:"Next"})]})}),p=s.story({render:()=>e.jsxs(n,{align:"center",children:[e.jsx(t,{isDisabled:!0,children:"Disabled"}),e.jsx(t,{defaultSelected:!0,isDisabled:!0,children:"Selected"})]})}),x=s.story({render:()=>{const[l,S]=j.useState(!1);return e.jsxs(n,{direction:"column",gap:"3",children:[e.jsx(t,{"aria-label":"Star",isSelected:l,onChange:S,iconStart:l?e.jsx(F,{}):e.jsx(h,{}),children:l?"Starred":"Not starred"}),e.jsxs(o,{children:["State: ",l?"selected":"unselected"]})]})}}),m=s.story({render:()=>{const[l,S]=j.useState(!1);return e.jsxs(n,{direction:"column",gap:"3",children:[e.jsxs(n,{align:"center",gap:"2",children:[e.jsx(t,{isDisabled:l,children:({isDisabled:r,isSelected:b})=>r?`Disabled ${b?"(Selected)":"(Unselected)"}`:`Enabled ${b?"(Selected)":"(Unselected)"}`}),e.jsx(t,{"aria-label":"Toggle disabled state",onChange:()=>S(!l),children:l?"Enable":"Disable"})]}),e.jsx(o,{children:"Toggle the button to change the disabled state and see text update"})]})}}),T=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsxs(n,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 1: Selection State"}),e.jsxs(n,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:l})=>l?"✓ Selected":"Not Selected"}),e.jsx(t,{children:({isSelected:l})=>l?"✓ Selected":"Not Selected"})]})]}),e.jsxs(n,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 2: Multiple States"}),e.jsxs(n,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:l,isHovered:S})=>{const r=[];return l?r.push("on"):r.push("off"),S&&r.push("hovered"),`Email (${r.join(", ")})`}}),e.jsx(t,{children:({isSelected:l,isHovered:S})=>{const r=[];return l?r.push("on"):r.push("off"),S&&r.push("hovered"),`Push (${r.join(", ")})`}})]})]}),e.jsxs(n,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 3: Conditional Icons"}),e.jsx(n,{align:"center",gap:"2",children:e.jsx(t,{children:({isSelected:l})=>e.jsxs(e.Fragment,{children:[l?e.jsx(F,{}):e.jsx(h,{}),e.jsx("span",{children:l?"Starred":"Star"})]})})})]}),e.jsxs(n,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 4: Status Indicators"}),e.jsxs(n,{align:"center",gap:"2",children:[e.jsx(t,{defaultSelected:!0,children:({isSelected:l})=>e.jsxs(n,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:l?"var(--bui-fg-success)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Active"})]})}),e.jsx(t,{children:({isSelected:l})=>e.jsxs(n,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:l?"var(--bui-fg-danger)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Inactive"})]})})]})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Default = () => <ToggleButton>Toggle</ToggleButton>;
`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Backgrounds = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default</Text>
      <Flex align="center" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 1</Text>
      <Flex align="center" bg="neutral-1" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 2</Text>
      <Flex align="center" bg="neutral-2" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Neutral 3</Text>
      <Flex align="center" bg="neutral-3" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
  </Flex>
);
`,...i.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const Sizes = () => (
  <Flex align="center">
    <ToggleButton size="small">Small</ToggleButton>
    <ToggleButton size="medium">Medium</ToggleButton>
  </Flex>
);
`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const WithIcons = () => (
  <Flex align="center">
    <ToggleButton iconStart={<RiStarLine />}>Favorite</ToggleButton>
    <ToggleButton iconStart={<RiStarFill />} defaultSelected>
      Favorite
    </ToggleButton>
    <ToggleButton iconEnd={<RiCheckLine />}>Favorite</ToggleButton>
    <ToggleButton iconEnd={<RiCheckLine />} />
  </Flex>
);
`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const IconsOnly = () => (
  <Flex align="center">
    <ToggleButton aria-label="Cloud" iconStart={<RiCloudLine />} />
    <ToggleButton
      aria-label="Starred"
      defaultSelected
      iconStart={<RiStarFill />}
    />
    <ToggleButton aria-label="Next" iconStart={<RiArrowRightSLine />} />
  </Flex>
);
`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const IconsAndText = () => (
  <Flex align="center">
    <ToggleButton iconStart={<RiCloudLine />}>Cloud</ToggleButton>
    <ToggleButton iconStart={<RiStarLine />}>Star</ToggleButton>
    <ToggleButton iconEnd={<RiArrowRightSLine />}>Next</ToggleButton>
  </Flex>
);
`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const Disabled = () => (
  <Flex align="center">
    <ToggleButton isDisabled>Disabled</ToggleButton>
    <ToggleButton defaultSelected isDisabled>
      Selected
    </ToggleButton>
  </Flex>
);
`,...p.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const Controlled = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Flex direction="column" gap="3">
      <ToggleButton
        aria-label="Star"
        isSelected={selected}
        onChange={setSelected}
        iconStart={selected ? <RiStarFill /> : <RiStarLine />}
      >
        {selected ? "Starred" : "Not starred"}
      </ToggleButton>
      <Text>State: {selected ? "selected" : "unselected"}</Text>
    </Flex>
  );
};
`,...x.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const FunctionChildren = () => {
  const [disabled, setDisabled] = useState(false);
  return (
    <Flex direction="column" gap="3">
      <Flex align="center" gap="2">
        <ToggleButton isDisabled={disabled}>
          {({ isDisabled, isSelected }) =>
            isDisabled
              ? \`Disabled \${isSelected ? "(Selected)" : "(Unselected)"}\`
              : \`Enabled \${isSelected ? "(Selected)" : "(Unselected)"}\`
          }
        </ToggleButton>
        <ToggleButton
          aria-label="Toggle disabled state"
          onChange={() => setDisabled(!disabled)}
        >
          {disabled ? "Enable" : "Disable"}
        </ToggleButton>
      </Flex>
      <Text>
        Toggle the button to change the disabled state and see text update
      </Text>
    </Flex>
  );
};
`,...m.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const DynamicContent = () => {
  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="2">
        <Text weight="bold">Example 1: Selection State</Text>
        <Flex align="center" gap="2">
          <ToggleButton defaultSelected>
            {({ isSelected }) => (isSelected ? "✓ Selected" : "Not Selected")}
          </ToggleButton>
          <ToggleButton>
            {({ isSelected }) => (isSelected ? "✓ Selected" : "Not Selected")}
          </ToggleButton>
        </Flex>
      </Flex>

      <Flex direction="column" gap="2">
        <Text weight="bold">Example 2: Multiple States</Text>
        <Flex align="center" gap="2">
          <ToggleButton defaultSelected>
            {({ isSelected, isHovered }) => {
              const states = [];
              if (isSelected) states.push("on");
              else states.push("off");
              if (isHovered) states.push("hovered");
              return \`Email (\${states.join(", ")})\`;
            }}
          </ToggleButton>
          <ToggleButton>
            {({ isSelected, isHovered }) => {
              const states = [];
              if (isSelected) states.push("on");
              else states.push("off");
              if (isHovered) states.push("hovered");
              return \`Push (\${states.join(", ")})\`;
            }}
          </ToggleButton>
        </Flex>
      </Flex>

      <Flex direction="column" gap="2">
        <Text weight="bold">Example 3: Conditional Icons</Text>
        <Flex align="center" gap="2">
          <ToggleButton>
            {({ isSelected }) => (
              <>
                {isSelected ? <RiStarFill /> : <RiStarLine />}
                <span>{isSelected ? "Starred" : "Star"}</span>
              </>
            )}
          </ToggleButton>
        </Flex>
      </Flex>

      <Flex direction="column" gap="2">
        <Text weight="bold">Example 4: Status Indicators</Text>
        <Flex align="center" gap="2">
          <ToggleButton defaultSelected>
            {({ isSelected }) => (
              <Flex align="center" gap="2">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: isSelected
                      ? "var(--bui-fg-success)"
                      : "var(--bui-fg-secondary)",
                  }}
                />
                <span>Active</span>
              </Flex>
            )}
          </ToggleButton>
          <ToggleButton>
            {({ isSelected }) => (
              <Flex align="center" gap="2">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: isSelected
                      ? "var(--bui-fg-danger)"
                      : "var(--bui-fg-secondary)",
                  }}
                />
                <span>Inactive</span>
              </Flex>
            )}
          </ToggleButton>
        </Flex>
      </Flex>
    </Flex>
  );
};
`,...T.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Toggle'
  }
})`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <Flex align="center" bg="neutral-1" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 2</Text>
        <Flex align="center" bg="neutral-2" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Neutral 3</Text>
        <Flex align="center" bg="neutral-3" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
    </Flex>
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
  render: () => <Flex align="center">
      <ToggleButton size="small">Small</ToggleButton>
      <ToggleButton size="medium">Medium</ToggleButton>
    </Flex>
})`,...c.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: 'Favorite'
  },
  render: args => <Flex align="center">
      <ToggleButton {...args} iconStart={<RiStarLine />} />
      <ToggleButton {...args} iconStart={<RiStarFill />} defaultSelected />
      <ToggleButton {...args} iconEnd={<RiCheckLine />} />
      <ToggleButton iconEnd={<RiCheckLine />} />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton aria-label="Cloud" iconStart={<RiCloudLine />} />
      <ToggleButton aria-label="Starred" defaultSelected iconStart={<RiStarFill />} />
      <ToggleButton aria-label="Next" iconStart={<RiArrowRightSLine />} />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton iconStart={<RiCloudLine />}>Cloud</ToggleButton>
      <ToggleButton iconStart={<RiStarLine />}>Star</ToggleButton>
      <ToggleButton iconEnd={<RiArrowRightSLine />}>Next</ToggleButton>
    </Flex>
})`,...u.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex align="center">
      <ToggleButton isDisabled>Disabled</ToggleButton>
      <ToggleButton defaultSelected isDisabled>
        Selected
      </ToggleButton>
    </Flex>
})`,...p.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => {
    const [selected, setSelected] = useState(false);
    return <Flex direction="column" gap="3">
        <ToggleButton aria-label="Star" isSelected={selected} onChange={setSelected} iconStart={selected ? <RiStarFill /> : <RiStarLine />}>
          {selected ? 'Starred' : 'Not starred'}
        </ToggleButton>
        <Text>State: {selected ? 'selected' : 'unselected'}</Text>
      </Flex>;
  }
})`,...x.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...m.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...T.input.parameters?.docs?.source}}};const _=["Default","Backgrounds","Sizes","WithIcons","IconsOnly","IconsAndText","Disabled","Controlled","FunctionChildren","DynamicContent"];export{i as Backgrounds,x as Controlled,a as Default,p as Disabled,T as DynamicContent,m as FunctionChildren,u as IconsAndText,g as IconsOnly,c as Sizes,d as WithIcons,_ as __namedExportsOrder};
