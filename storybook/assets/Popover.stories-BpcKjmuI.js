import{r as C,j as e,p as L}from"./iframe-M9O-K8SB.js";import{$ as N}from"./OverlayArrow-CcKR7RW9.js";import{$ as S}from"./Dialog-DGmZero8.js";import{c as A}from"./clsx-B-dksMZM.js";import{u as R}from"./useStyles-BRwt6BXn.js";import{P as F,s as q}from"./Popover.module-CIIeSXYs.js";import{B as f}from"./Button-BbTpZl37.js";import{D as O}from"./Dialog-BJ3f-Jka.js";import{T as r}from"./Text-RD33cT1s.js";import{F as B}from"./Flex-Bz2InqMs.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-BwFERnd_.js";import"./useObjectRef-BPFp5snO.js";import"./Button-Dkbd3KcU.js";import"./utils-BXllfVt4.js";import"./Label-o9S_v-xF.js";import"./Hidden-DTd05gNK.js";import"./useLabel-COjMvP6r.js";import"./useLabels-C3g0X61E.js";import"./context-Bv6kxITJ.js";import"./useButton-F9hepFpV.js";import"./usePress-ByOsZuB9.js";import"./useFocusRing-COnCKKka.js";import"./useControlledState-DzBnLbpE.js";import"./RSPContexts-BdpIjeVF.js";import"./SelectionManager-AOhnTTKk.js";import"./useEvent-BRbGx-1q.js";import"./SelectionIndicator-yhlvspp_.js";import"./Separator-CPZLX6dD.js";import"./Text-B7PuQZMK.js";import"./useLocalizedStringFormatter-C4c9cZU5.js";import"./animation-D5pTcXzL.js";import"./VisuallyHidden-BvkZfodz.js";import"./index-BKJKY9Wv.js";import"./defineComponent-BmABoWOu.js";import"./useSurface-CJaN3YoD.js";import"./Heading-i6qdobEN.js";const o=C.forwardRef((n,i)=>{const{classNames:a,cleanedProps:P}=R(F,n),{className:w,children:j,hideArrow:b,...y}=P;return e.jsx(S,{className:A(a.root,q[a.root],w),...y,ref:i,children:({trigger:D})=>e.jsxs(e.Fragment,{children:[!b&&D!=="MenuTrigger"&&D!=="SubmenuTrigger"&&e.jsx(N,{className:A(a.arrow,q[a.arrow]),children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[e.jsx("path",{d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"}),e.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),e.jsx("div",{className:A(a.content,q[a.content]),children:j})]})})});o.displayName="Popover";o.__docgenInfo={description:`A popover component built on React Aria Components that displays floating
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

@defaultValue false`}},composes:["Omit"]};const W=L.meta({title:"Backstage UI/Popover",component:o,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},hideArrow:{control:{type:"boolean"}},placement:{control:{type:"select"},options:["top","top start","top end","bottom","bottom start","bottom end","left","left start","left end","right","right start","right end"]},offset:{control:{type:"number"}}},render:({children:n,isOpen:i,hideArrow:a,placement:P,offset:w})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:i,hideArrow:a,placement:P,offset:w,children:n??e.jsx(r,{children:"This is a popover"})})]})}),t=W.story({args:{children:e.jsx(r,{children:"This is a popover"})}}),s=t.extend({args:{isOpen:!0}}),p=t.extend({args:{isOpen:!0,hideArrow:!0}}),c=t.extend({args:{isOpen:!0,placement:"top"}}),l=t.extend({args:{isOpen:!0,placement:"right"}}),m=t.extend({args:{isOpen:!0,placement:"bottom"}}),u=t.extend({args:{isOpen:!0,placement:"left"}}),d=t.extend({parameters:{controls:{exclude:["placement"]}},args:{isOpen:!0},render:({isOpen:n,hideArrow:i})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popovers"}),e.jsx(o,{isOpen:n,placement:"top",hideArrow:i,children:e.jsx(r,{children:"Top placement"})}),e.jsx(o,{isOpen:n,placement:"right",hideArrow:i,children:e.jsx(r,{children:"Right placement"})}),e.jsx(o,{isOpen:n,placement:"bottom",hideArrow:i,children:e.jsx(r,{children:"Bottom placement"})}),e.jsx(o,{isOpen:n,placement:"left",hideArrow:i,children:e.jsx(r,{children:"Left placement"})})]})}),h=t.extend({parameters:{controls:{exclude:["placement","hideArrow"]}},args:{isOpen:!0,hideArrow:!0},render:({isOpen:n})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popovers"}),e.jsx(o,{isOpen:n,placement:"top",hideArrow:!0,children:e.jsx(r,{children:"Top placement"})}),e.jsx(o,{isOpen:n,placement:"right",hideArrow:!0,children:e.jsx(r,{children:"Right placement"})}),e.jsx(o,{isOpen:n,placement:"bottom",hideArrow:!0,children:e.jsx(r,{children:"Bottom placement"})}),e.jsx(o,{isOpen:n,placement:"left",hideArrow:!0,children:e.jsx(r,{children:"Left placement"})})]})}),g=t.extend({args:{isOpen:!0},render:({isOpen:n,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:n,hideArrow:i,placement:a,children:e.jsxs(B,{direction:"column",gap:"3",style:{width:"280px"},children:[e.jsx(r,{style:{fontWeight:"bold"},children:"Popover Title"}),e.jsx(r,{children:"This is a popover with rich content. It can contain multiple elements and formatted text."}),e.jsxs(B,{gap:"2",justify:"end",children:[e.jsx(f,{variant:"tertiary",size:"small",children:"Cancel"}),e.jsx(f,{variant:"primary",size:"small",children:"Confirm"})]})]})})]})}),x=t.extend({args:{isOpen:!0,offset:20,placement:"bottom"}}),T=t.extend({args:{isOpen:!0},render:({isOpen:n,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Non-Modal Popover"}),e.jsx(o,{isOpen:n,hideArrow:i,placement:a,isNonModal:!0,children:e.jsx(r,{children:"This is a non-modal popover. You can interact with other elements on the page while it's open."})})]})}),v=t.extend({args:{isOpen:!0},render:({isOpen:n,hideArrow:i,placement:a})=>e.jsxs(O,{children:[e.jsx(f,{children:"Open Popover"}),e.jsx(o,{isOpen:n,hideArrow:i,placement:a,children:e.jsxs(B,{direction:"column",gap:"3",style:{width:"320px"},children:[e.jsx(r,{style:{fontWeight:"bold"},children:"Long Content Example"}),e.jsx(r,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(r,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(r,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}),e.jsx(r,{children:"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}),e.jsx(r,{children:"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."})]})})]})});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{code:`const Default = ({ children, isOpen, hideArrow, placement, offset }) => (
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
`,...t.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{code:`const IsOpen = ({ children, isOpen, hideArrow, placement, offset }) => (
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
`,...d.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{code:`const AllPlacementsNoArrow = ({ isOpen }) => {
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
`,...h.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{code:`const WithRichContent = ({ isOpen, hideArrow, placement }) => (
  <DialogTrigger>
    <Button>Open Popover</Button>
    <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
      <Flex direction="column" gap="3" style={{ width: "280px" }}>
        <Text style={{ fontWeight: "bold" }}>Popover Title</Text>
        <Text>
          This is a popover with rich content. It can contain multiple elements
          and formatted text.
        </Text>
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
`,...g.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{code:`const CustomOffset = ({ children, isOpen, hideArrow, placement, offset }) => (
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
`,...v.input.parameters?.docs?.source}}};t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <Text>This is a popover</Text>
  }
})`,...t.input.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...v.parameters?.docs?.source}}};const Oe=["Default","IsOpen","HideArrow","TopPlacement","RightPlacement","BottomPlacement","LeftPlacement","AllPlacements","AllPlacementsNoArrow","WithRichContent","CustomOffset","NonModal","WithLongContent"];export{d as AllPlacements,h as AllPlacementsNoArrow,m as BottomPlacement,x as CustomOffset,t as Default,p as HideArrow,s as IsOpen,u as LeftPlacement,T as NonModal,l as RightPlacement,c as TopPlacement,v as WithLongContent,g as WithRichContent,Oe as __namedExportsOrder};
