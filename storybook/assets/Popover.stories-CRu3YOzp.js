import{r as y,am as C,j as e,an as L,B as j,p as N}from"./iframe-C-coJuUP.js";import{$ as S}from"./OverlayArrow-DxZbtYsM.js";import{$ as R}from"./Dialog-B0jlD4kA.js";import{P as F}from"./definition-DvcnS4CZ.js";import{d as I}from"./useObjectRef-DoPsICjD.js";import{B as f}from"./Button-DpSWUZkC.js";import{D as O}from"./Dialog-B699lBIq.js";import{T as n}from"./Text-DZJ2bZ47.js";import{F as b}from"./Flex-DEyiuRhH.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-C8ZXMjCr.js";import"./Button-HgcBqqAF.js";import"./utils-U8J9_ypZ.js";import"./Label-DuiviT5b.js";import"./Hidden-BZos0PUt.js";import"./useLabel-3gXC22RO.js";import"./useLabels-DyUMAXd4.js";import"./context-eVH2RLAG.js";import"./useButton-DbPnANzN.js";import"./usePress-B_AIff1O.js";import"./useFocusRing-DdAH67IB.js";import"./useControlledState-D-0r9ToY.js";import"./RSPContexts-CuY07Jw8.js";import"./SelectionManager-D4YKos0-.js";import"./useEvent-2i228D4Y.js";import"./SelectionIndicator-Bqf07bwT.js";import"./Separator-BOzZKzQx.js";import"./Text-CeDmJawZ.js";import"./useLocalizedStringFormatter-DwBdGSGd.js";import"./animation-C6oqXIRO.js";import"./VisuallyHidden-CEXt6C6h.js";import"./index-l0R7Uc5Q.js";import"./Heading-DZcjmDFE.js";const o=y.forwardRef((t,i)=>{const{ownProps:a,restProps:w}=C(F,t),{classes:P,children:B,hideArrow:D}=a,A=I();return e.jsx(R,{className:P.root,...w,ref:i,children:({trigger:q})=>e.jsxs(e.Fragment,{children:[!D&&q!=="MenuTrigger"&&q!=="SubmenuTrigger"&&e.jsx(S,{className:P.arrow,children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[e.jsx("defs",{children:e.jsx("path",{id:A,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),e.jsx("use",{href:`#${A}`}),e.jsx("use",{href:`#${A}`}),e.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),e.jsx(L,{children:e.jsx(j,{bg:"neutral",className:P.content,children:B})})]})})});o.displayName="Popover";o.__docgenInfo={description:`A popover component built on React Aria Components that displays floating
content anchored to a trigger element.

@remarks
The Popover component supports multiple placements (top, right, bottom, left),
automatic viewport-constrained scrolling, and conditional arrow rendering. It
automatically handles positioning, collision detection, and ARIA attributes for
accessibility. Content is automatically padded and scrollable when it exceeds
available space.

@example
Basic usage with DialogTrigger:
\`\`\`tsx
<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>Popover content</Text>
  </Popover>
</DialogTrigger>
\`\`\`

@example
With custom placement and no arrow:
\`\`\`tsx
<DialogTrigger>
  <Button>Open</Button>
  <Popover placement="right" hideArrow>
    <Text>Content without arrow</Text>
  </Popover>
</DialogTrigger>
\`\`\`

@public`,methods:[],displayName:"Popover",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:`The content to display inside the popover.
Content is automatically wrapped with padding and scroll behavior.`},hideArrow:{required:!1,tsType:{name:"boolean"},description:`Whether to hide the arrow pointing to the trigger element.
Arrow is also automatically hidden for MenuTrigger and SubmenuTrigger contexts.

@defaultValue false`},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const M=N.meta({title:"Backstage UI/Popover",component:o,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},hideArrow:{control:{type:"boolean"}},placement:{control:{type:"select"},options:["top","top start","top end","bottom","bottom start","bottom end","left","left start","left end","right","right start","right end"]},offset:{control:{type:"number"}}},render:({children:t,isOpen:i,hideArrow:a,placement:w,offset:P})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:i,hideArrow:a,placement:w,offset:P,children:t??e.jsx(n,{children:"This is a popover"})})]})}),r=M.story({args:{children:e.jsx(n,{children:"This is a popover"})}}),s=r.extend({parameters:{layout:"fullscreen"},decorators:[t=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(t,{})})],args:{isOpen:!0}}),p=r.extend({args:{isOpen:!0,hideArrow:!0}}),c=r.extend({args:{isOpen:!0,placement:"top"}}),l=r.extend({args:{isOpen:!0,placement:"right"}}),m=r.extend({args:{isOpen:!0,placement:"bottom"}}),u=r.extend({args:{isOpen:!0,placement:"left"}}),d=r.extend({parameters:{controls:{exclude:["placement"]}},args:{isOpen:!0},render:({isOpen:t,hideArrow:i})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popovers"}),e.jsx(o,{isOpen:t,placement:"top",hideArrow:i,children:e.jsx(n,{children:"Top placement"})}),e.jsx(o,{isOpen:t,placement:"right",hideArrow:i,children:e.jsx(n,{children:"Right placement"})}),e.jsx(o,{isOpen:t,placement:"bottom",hideArrow:i,children:e.jsx(n,{children:"Bottom placement"})}),e.jsx(o,{isOpen:t,placement:"left",hideArrow:i,children:e.jsx(n,{children:"Left placement"})})]})}),g=r.extend({parameters:{controls:{exclude:["placement","hideArrow"]}},args:{isOpen:!0,hideArrow:!0},render:({isOpen:t})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popovers"}),e.jsx(o,{isOpen:t,placement:"top",hideArrow:!0,children:e.jsx(n,{children:"Top placement"})}),e.jsx(o,{isOpen:t,placement:"right",hideArrow:!0,children:e.jsx(n,{children:"Right placement"})}),e.jsx(o,{isOpen:t,placement:"bottom",hideArrow:!0,children:e.jsx(n,{children:"Bottom placement"})}),e.jsx(o,{isOpen:t,placement:"left",hideArrow:!0,children:e.jsx(n,{children:"Left placement"})})]})}),h=r.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:t,hideArrow:i,placement:a,children:e.jsxs(b,{direction:"column",gap:"3",style:{width:"280px"},children:[e.jsx(n,{style:{fontWeight:"bold"},children:"Popover Title"}),e.jsx(n,{children:"This is a popover with rich content. It can contain multiple elements and formatted text."}),e.jsx(j,{bg:"neutral",p:"2",children:e.jsx(n,{children:"You can also use the automatic bg system inside it."})}),e.jsxs(b,{gap:"2",justify:"end",children:[e.jsx(f,{variant:"tertiary",size:"small",children:"Cancel"}),e.jsx(f,{variant:"primary",size:"small",children:"Confirm"})]})]})})]})}),x=r.extend({args:{isOpen:!0,offset:20,placement:"bottom"}}),T=r.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Non-Modal Popover"}),e.jsx(o,{isOpen:t,hideArrow:i,placement:a,isNonModal:!0,children:e.jsx(n,{children:"This is a non-modal popover. You can interact with other elements on the page while it's open."})})]})}),v=r.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:t,hideArrow:i,placement:a,children:e.jsxs(b,{direction:"column",gap:"3",style:{width:"320px"},children:[e.jsx(n,{style:{fontWeight:"bold"},children:"Long Content Example"}),e.jsx(n,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(n,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(n,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}),e.jsx(n,{children:"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}),e.jsx(n,{children:"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."})]})})]})});r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...r.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const IsOpen = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...s.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{code:`const HideArrow = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{code:`const TopPlacement = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...c.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{code:`const RightPlacement = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...l.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{code:`const BottomPlacement = ({
  children,
  isOpen,
  hideArrow,
  placement,
  offset,
}) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...m.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{code:`const LeftPlacement = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...u.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{code:`const AllPlacements = ({ isOpen, hideArrow }) => {
  return (
    <DialogTrigger>
      <Button>Open Popovers</Button>
      <Popover isOpen={isOpen} placement="top" hideArrow={hideArrow}>
        <Text>Top placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="right" hideArrow={hideArrow}>
        <Text>Right placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="bottom" hideArrow={hideArrow}>
        <Text>Bottom placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="left" hideArrow={hideArrow}>
        <Text>Left placement</Text>
      </Popover>
    </DialogTrigger>
  );
};
`,...d.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const AllPlacementsNoArrow = ({ isOpen }) => {
  return (
    <DialogTrigger>
      <Button>Open Popovers</Button>
      <Popover isOpen={isOpen} placement="top" hideArrow>
        <Text>Top placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="right" hideArrow>
        <Text>Right placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="bottom" hideArrow>
        <Text>Bottom placement</Text>
      </Popover>
      <Popover isOpen={isOpen} placement="left" hideArrow>
        <Text>Left placement</Text>
      </Popover>
    </DialogTrigger>
  );
};
`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const WithRichContent = ({ isOpen, hideArrow, placement }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
      <Flex direction="column" gap="3" style={{ width: "280px" }}>
        <Text style={{ fontWeight: "bold" }}>Popover Title</Text>
        <Text>
          This is a popover with rich content. It can contain multiple elements
          and formatted text.
        </Text>
        <Box bg="neutral" p="2">
          <Text>You can also use the automatic bg system inside it.</Text>
        </Box>
        <Flex gap="2" justify="end">
          <Button variant="tertiary" size="small">
            Cancel
          </Button>
          <Button variant="primary" size="small">
            Confirm
          </Button>
        </Flex>
      </Flex>
    </Popover>
  </DialogTrigger>
);
`,...h.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const CustomOffset = ({ children, isOpen, hideArrow, placement, offset }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      offset={offset}
    >
      {children ?? <Text>This is a popover</Text>}
    </Popover>
  </DialogTrigger>
);
`,...x.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{code:`const NonModal = ({ isOpen, hideArrow, placement }) => (
  <DialogTrigger>
    <Button>Open Non-Modal Popover</Button>
    <Popover
      isOpen={isOpen}
      hideArrow={hideArrow}
      placement={placement}
      isNonModal
    >
      <Text>
        This is a non-modal popover. You can interact with other elements on the
        page while it's open.
      </Text>
    </Popover>
  </DialogTrigger>
);
`,...T.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{code:`const WithLongContent = ({ isOpen, hideArrow, placement }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
      <Flex direction="column" gap="3" style={{ width: "320px" }}>
        <Text style={{ fontWeight: "bold" }}>Long Content Example</Text>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
        <Text>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </Text>
        <Text>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </Text>
        <Text>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt.
        </Text>
        <Text>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit, sed quia non numquam eius modi tempora
          incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </Text>
      </Flex>
    </Popover>
  </DialogTrigger>
);
`,...v.input.parameters?.docs?.source}}};r.input.parameters={...r.input.parameters,docs:{...r.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <Text>This is a popover</Text>
  }
})`,...r.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [Story => <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)',
    backgroundSize: '16px 16px'
  }}>
        <Story />
      </div>],
  args: {
    isOpen: true
  }
})`,...s.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    hideArrow: true
  }
})`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'top'
  }
})`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'right'
  }
})`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'bottom'
  }
})`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'left'
  }
})`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`Default.extend({
  parameters: {
    controls: {
      exclude: ['placement']
    }
  },
  args: {
    isOpen: true
  },
  render: ({
    isOpen,
    hideArrow
  }) => {
    return <DialogTrigger>
        <Button>Open Popovers</Button>
        <Popover isOpen={isOpen} placement="top" hideArrow={hideArrow}>
          <Text>Top placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="right" hideArrow={hideArrow}>
          <Text>Right placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="bottom" hideArrow={hideArrow}>
          <Text>Bottom placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="left" hideArrow={hideArrow}>
          <Text>Left placement</Text>
        </Popover>
      </DialogTrigger>;
  }
})`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`Default.extend({
  parameters: {
    controls: {
      exclude: ['placement', 'hideArrow']
    }
  },
  args: {
    isOpen: true,
    hideArrow: true
  },
  render: ({
    isOpen
  }) => {
    return <DialogTrigger>
        <Button>Open Popovers</Button>
        <Popover isOpen={isOpen} placement="top" hideArrow>
          <Text>Top placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="right" hideArrow>
          <Text>Right placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="bottom" hideArrow>
          <Text>Bottom placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="left" hideArrow>
          <Text>Left placement</Text>
        </Popover>
      </DialogTrigger>;
  }
})`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true
  },
  render: ({
    isOpen,
    hideArrow,
    placement
  }) => <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
        <Flex direction="column" gap="3" style={{
        width: '280px'
      }}>
          <Text style={{
          fontWeight: 'bold'
        }}>Popover Title</Text>
          <Text>
            This is a popover with rich content. It can contain multiple
            elements and formatted text.
          </Text>
          <Box bg="neutral" p="2">
            <Text>You can also use the automatic bg system inside it.</Text>
          </Box>
          <Flex gap="2" justify="end">
            <Button variant="tertiary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Popover>
    </DialogTrigger>
})`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    offset: 20,
    placement: 'bottom'
  }
})`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true
  },
  render: ({
    isOpen,
    hideArrow,
    placement
  }) => <DialogTrigger>
      <Button>Open Non-Modal Popover</Button>
      <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement} isNonModal>
        <Text>
          This is a non-modal popover. You can interact with other elements on
          the page while it's open.
        </Text>
      </Popover>
    </DialogTrigger>
})`,...T.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true
  },
  render: ({
    isOpen,
    hideArrow,
    placement
  }) => <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
        <Flex direction="column" gap="3" style={{
        width: '320px'
      }}>
          <Text style={{
          fontWeight: 'bold'
        }}>Long Content Example</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
          <Text>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </Text>
          <Text>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora
            incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </Text>
        </Flex>
      </Popover>
    </DialogTrigger>
})`,...v.parameters?.docs?.source}}};const Te=["Default","IsOpen","HideArrow","TopPlacement","RightPlacement","BottomPlacement","LeftPlacement","AllPlacements","AllPlacementsNoArrow","WithRichContent","CustomOffset","NonModal","WithLongContent"];export{d as AllPlacements,g as AllPlacementsNoArrow,m as BottomPlacement,x as CustomOffset,r as Default,p as HideArrow,s as IsOpen,u as LeftPlacement,T as NonModal,l as RightPlacement,c as TopPlacement,v as WithLongContent,h as WithRichContent,Te as __namedExportsOrder};
