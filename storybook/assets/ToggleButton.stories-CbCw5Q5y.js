import{p as D,j as e,r as f}from"./iframe-M9O-K8SB.js";import{T as n}from"./ToggleButton-Dmyuo9NW.js";import{q as h,e as F,s as b,T as j,r as y}from"./index-BKJKY9Wv.js";import{F as t}from"./Flex-Bz2InqMs.js";import{T as o}from"./Text-RD33cT1s.js";import"./preload-helper-PPVm8Dsz.js";import"./clsx-B-dksMZM.js";import"./utils-BXllfVt4.js";import"./useObjectRef-BPFp5snO.js";import"./SelectionIndicator-yhlvspp_.js";import"./useFocusable-BwFERnd_.js";import"./useControlledState-DzBnLbpE.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./context-Bv6kxITJ.js";import"./useToggleState-O3dGrC2P.js";import"./useFocusRing-COnCKKka.js";import"./useStyles-BRwt6BXn.js";import"./useSurface-CJaN3YoD.js";const s=D.meta({title:"Backstage UI/ToggleButton",component:n,argTypes:{size:{control:"select",options:["small","medium"]}}}),a=s.story({args:{children:"Toggle"}}),i=s.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(o,{children:"Default"}),e.jsx(t,{align:"center",p:"4",children:e.jsx(n,{children:"Toggle"})})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Surface 0"}),e.jsx(t,{align:"center",surface:"0",p:"4",children:e.jsx(n,{children:"Toggle"})})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Surface 1"}),e.jsx(t,{align:"center",surface:"1",p:"4",children:e.jsx(n,{children:"Toggle"})})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Surface 2"}),e.jsx(t,{align:"center",surface:"2",p:"4",children:e.jsx(n,{children:"Toggle"})})]}),e.jsxs(t,{direction:"column",gap:"4",children:[e.jsx(o,{children:"On Surface 3"}),e.jsx(t,{align:"center",surface:"3",p:"4",children:e.jsx(n,{children:"Toggle"})})]})]})}),c=s.story({args:{children:"Toggle"},parameters:{argTypes:{size:{control:!1}}},render:()=>e.jsxs(t,{align:"center",children:[e.jsx(n,{size:"small",children:"Small"}),e.jsx(n,{size:"medium",children:"Medium"})]})}),d=s.story({args:{children:"Favorite"},render:l=>e.jsxs(t,{align:"center",children:[e.jsx(n,{...l,iconStart:e.jsx(h,{})}),e.jsx(n,{...l,iconStart:e.jsx(F,{}),defaultSelected:!0}),e.jsx(n,{...l,iconEnd:e.jsx(b,{})}),e.jsx(n,{iconEnd:e.jsx(b,{})})]})}),g=s.story({render:()=>e.jsxs(t,{align:"center",children:[e.jsx(n,{"aria-label":"Cloud",iconStart:e.jsx(j,{})}),e.jsx(n,{"aria-label":"Starred",defaultSelected:!0,iconStart:e.jsx(F,{})}),e.jsx(n,{"aria-label":"Next",iconStart:e.jsx(y,{})})]})}),u=s.story({render:()=>e.jsxs(t,{align:"center",children:[e.jsx(n,{iconStart:e.jsx(j,{}),children:"Cloud"}),e.jsx(n,{iconStart:e.jsx(h,{}),children:"Star"}),e.jsx(n,{iconEnd:e.jsx(y,{}),children:"Next"})]})}),p=s.story({render:()=>e.jsxs(t,{align:"center",children:[e.jsx(n,{isDisabled:!0,children:"Disabled"}),e.jsx(n,{defaultSelected:!0,isDisabled:!0,children:"Selected"})]})}),x=s.story({render:()=>{const[l,T]=f.useState(!1);return e.jsxs(t,{direction:"column",gap:"3",children:[e.jsx(n,{"aria-label":"Star",isSelected:l,onChange:T,iconStart:l?e.jsx(F,{}):e.jsx(h,{}),children:l?"Starred":"Not starred"}),e.jsxs(o,{children:["State: ",l?"selected":"unselected"]})]})}}),m=s.story({render:()=>{const[l,T]=f.useState(!1);return e.jsxs(t,{direction:"column",gap:"3",children:[e.jsxs(t,{align:"center",gap:"2",children:[e.jsx(n,{isDisabled:l,children:({isDisabled:r,isSelected:B})=>r?`Disabled ${B?"(Selected)":"(Unselected)"}`:`Enabled ${B?"(Selected)":"(Unselected)"}`}),e.jsx(n,{"aria-label":"Toggle disabled state",onChange:()=>T(!l),children:l?"Enable":"Disable"})]}),e.jsx(o,{children:"Toggle the button to change the disabled state and see text update"})]})}}),S=s.story({render:()=>e.jsxs(t,{direction:"column",gap:"4",children:[e.jsxs(t,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 1: Selection State"}),e.jsxs(t,{align:"center",gap:"2",children:[e.jsx(n,{defaultSelected:!0,children:({isSelected:l})=>l?"✓ Selected":"Not Selected"}),e.jsx(n,{children:({isSelected:l})=>l?"✓ Selected":"Not Selected"})]})]}),e.jsxs(t,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 2: Multiple States"}),e.jsxs(t,{align:"center",gap:"2",children:[e.jsx(n,{defaultSelected:!0,children:({isSelected:l,isHovered:T})=>{const r=[];return l?r.push("on"):r.push("off"),T&&r.push("hovered"),`Email (${r.join(", ")})`}}),e.jsx(n,{children:({isSelected:l,isHovered:T})=>{const r=[];return l?r.push("on"):r.push("off"),T&&r.push("hovered"),`Push (${r.join(", ")})`}})]})]}),e.jsxs(t,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 3: Conditional Icons"}),e.jsx(t,{align:"center",gap:"2",children:e.jsx(n,{children:({isSelected:l})=>e.jsxs(e.Fragment,{children:[l?e.jsx(F,{}):e.jsx(h,{}),e.jsx("span",{children:l?"Starred":"Star"})]})})})]}),e.jsxs(t,{direction:"column",gap:"2",children:[e.jsx(o,{weight:"bold",children:"Example 4: Status Indicators"}),e.jsxs(t,{align:"center",gap:"2",children:[e.jsx(n,{defaultSelected:!0,children:({isSelected:l})=>e.jsxs(t,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:l?"var(--bui-fg-success)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Active"})]})}),e.jsx(n,{children:({isSelected:l})=>e.jsxs(t,{align:"center",gap:"2",children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",backgroundColor:l?"var(--bui-fg-danger)":"var(--bui-fg-secondary)"}}),e.jsx("span",{children:"Inactive"})]})})]})]})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{code:`const Default = () => <ToggleButton>Toggle</ToggleButton>;
`,...a.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{code:`const Surfaces = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default</Text>
      <Flex align="center" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 0</Text>
      <Flex align="center" surface="0" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 1</Text>
      <Flex align="center" surface="1" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 2</Text>
      <Flex align="center" surface="2" p="4">
        <ToggleButton>Toggle</ToggleButton>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 3</Text>
      <Flex align="center" surface="3" p="4">
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
`,...m.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{code:`const DynamicContent = () => {
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
`,...S.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
        <Text>On Surface 0</Text>
        <Flex align="center" surface="0" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 1</Text>
        <Flex align="center" surface="1" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 2</Text>
        <Flex align="center" surface="2" p="4">
          <ToggleButton>Toggle</ToggleButton>
        </Flex>
      </Flex>
      <Flex direction="column" gap="4">
        <Text>On Surface 3</Text>
        <Flex align="center" surface="3" p="4">
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
})`,...m.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...S.input.parameters?.docs?.source}}};const _=["Default","Surfaces","Sizes","WithIcons","IconsOnly","IconsAndText","Disabled","Controlled","FunctionChildren","DynamicContent"];export{x as Controlled,a as Default,p as Disabled,S as DynamicContent,m as FunctionChildren,u as IconsAndText,g as IconsOnly,c as Sizes,i as Surfaces,d as WithIcons,_ as __namedExportsOrder};
