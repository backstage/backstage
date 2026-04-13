import{r as B,au as C,j as e,av as L,B as y,p as S}from"./iframe-DgHKkkyr.js";import{$ as N}from"./OverlayArrow-BanbCYZ7.js";import{$ as R}from"./Dialog-DZwDG78Z.js";import{P as I}from"./definition-eE0EgXK2.js";import{d as $}from"./useObjectRef-DMH-GBhM.js";import{B as s}from"./Button-RPoPv-4P.js";import{D as p}from"./Dialog-Dgm6z4-h.js";import{T as r}from"./Text-DfksO4NV.js";import{F as P}from"./Flex-C1C4BYK1.js";import"./preload-helper-PPVm8Dsz.js";import"./useFocusable-B6BeVSwN.js";import"./openLink-iVgFRcvl.js";import"./useNumberFormatter-BariNU_U.js";import"./context-BV7aFW6r.js";import"./useControlledState-CkXk69k2.js";import"./utils-C1o7BLsy.js";import"./Button-DQWFpuFN.js";import"./Label-DFt2BgeJ.js";import"./Hidden-DNRCN_ic.js";import"./useLabel-RftGCJTm.js";import"./useLabels-BOBl8S-u.js";import"./useButton-BS5Nc_U6.js";import"./usePress-yYF-Bh9Q.js";import"./textSelection-DDomQQoV.js";import"./useFocusRing-qkMzq-Jc.js";import"./RSPContexts-BpYxsdfF.js";import"./SelectionManager-R8d54xYK.js";import"./useEvent-HT8lmTYY.js";import"./SelectionIndicator-DxQ47DhH.js";import"./Separator-DkbZUtJM.js";import"./Text-Br96A3dM.js";import"./useLocalizedStringFormatter-BOuFZVr0.js";import"./animation-CtoIKT8l.js";import"./VisuallyHidden-DFvP1mHt.js";import"./index-DXCmj24P.js";import"./Heading-r71NO2Ff.js";const n=B.forwardRef((t,a)=>{const{ownProps:i,restProps:O}=C(I,t),{classes:l,children:A,hideArrow:D}=i,b=$();return e.jsx(R,{className:l.root,...O,ref:a,children:({trigger:q})=>e.jsxs(e.Fragment,{children:[!D&&q!=="MenuTrigger"&&q!=="SubmenuTrigger"&&e.jsx(N,{className:l.arrow,children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[e.jsx("defs",{children:e.jsx("path",{id:b,fillRule:"evenodd",d:"M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V7.94781e-07L1.74846e-07 -9.53674e-07L0 2L1.4651 2C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})}),e.jsx("use",{href:`#${b}`}),e.jsx("use",{href:`#${b}`}),e.jsx("path",{d:"M11.0046 8.14124C10.2439 8.82575 9.08939 8.82578 8.32869 8.14122L3.47189 3.77011C2.92109 3.27432 2.20619 2.99999 1.46509 2.99999L4.10999 3L8.99769 7.39793C9.37799 7.7402 9.95529 7.7402 10.3356 7.39793L15.2226 3L17.8683 2.99999C17.1271 2.99999 16.4122 3.27432 15.8614 3.77011L11.0046 8.14124Z"})]})}),e.jsx(L,{children:e.jsx(y,{bg:"neutral",className:l.content,children:A})})]})})});n.displayName="Popover";n.__docgenInfo={description:`A popover component built on React Aria Components that displays floating
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

@defaultValue false`},className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const M=S.meta({title:"Backstage UI/Popover",component:n,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},hideArrow:{control:{type:"boolean"}},placement:{control:{type:"select"},options:["top","top start","top end","bottom","bottom start","bottom end","left","left start","left end","right","right start","right end"]},offset:{control:{type:"number"}}},render:({children:t,isOpen:a,hideArrow:i,placement:O,offset:l})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Popover"}),e.jsx(n,{isOpen:a,hideArrow:i,placement:O,offset:l,children:t??e.jsx(r,{children:"This is a popover"})})]})}),o=M.story({args:{children:e.jsx(r,{children:"This is a popover"})}}),c=o.extend({parameters:{layout:"fullscreen"},decorators:[t=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(t,{})})],args:{isOpen:!0}}),m=o.extend({args:{isOpen:!0,hideArrow:!0}}),d=o.extend({args:{isOpen:!0,placement:"top"}}),u=o.extend({args:{isOpen:!0,placement:"right"}}),x=o.extend({args:{isOpen:!0,placement:"bottom"}}),h=o.extend({args:{isOpen:!0,placement:"left"}}),g=o.extend({parameters:{controls:{exclude:["placement"]}},args:{isOpen:!0},render:({isOpen:t,hideArrow:a})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Popovers"}),e.jsx(n,{isOpen:t,placement:"top",hideArrow:a,children:e.jsx(r,{children:"Top placement"})}),e.jsx(n,{isOpen:t,placement:"right",hideArrow:a,children:e.jsx(r,{children:"Right placement"})}),e.jsx(n,{isOpen:t,placement:"bottom",hideArrow:a,children:e.jsx(r,{children:"Bottom placement"})}),e.jsx(n,{isOpen:t,placement:"left",hideArrow:a,children:e.jsx(r,{children:"Left placement"})})]})}),v=o.extend({parameters:{controls:{exclude:["placement","hideArrow"]}},args:{isOpen:!0,hideArrow:!0},render:({isOpen:t})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Popovers"}),e.jsx(n,{isOpen:t,placement:"top",hideArrow:!0,children:e.jsx(r,{children:"Top placement"})}),e.jsx(n,{isOpen:t,placement:"right",hideArrow:!0,children:e.jsx(r,{children:"Right placement"})}),e.jsx(n,{isOpen:t,placement:"bottom",hideArrow:!0,children:e.jsx(r,{children:"Bottom placement"})}),e.jsx(n,{isOpen:t,placement:"left",hideArrow:!0,children:e.jsx(r,{children:"Left placement"})})]})}),f=o.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:a,placement:i})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Popover"}),e.jsx(n,{isOpen:t,hideArrow:a,placement:i,children:e.jsxs(P,{direction:"column",gap:"3",style:{width:"280px"},children:[e.jsx(r,{style:{fontWeight:"bold"},children:"Popover Title"}),e.jsx(r,{children:"This is a popover with rich content. It can contain multiple elements and formatted text."}),e.jsx(y,{bg:"neutral",p:"2",children:e.jsx(r,{children:"You can also use the automatic bg system inside it."})}),e.jsxs(P,{gap:"2",justify:"end",children:[e.jsx(s,{variant:"tertiary",size:"small",children:"Cancel"}),e.jsx(s,{variant:"primary",size:"small",children:"Confirm"})]})]})})]})}),T=o.extend({args:{isOpen:!0,offset:20,placement:"bottom"}}),j=o.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:a,placement:i})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Non-Modal Popover"}),e.jsx(n,{isOpen:t,hideArrow:a,placement:i,isNonModal:!0,children:e.jsx(r,{children:"This is a non-modal popover. You can interact with other elements on the page while it's open."})})]})}),w=o.extend({args:{isOpen:!0},render:({isOpen:t,hideArrow:a,placement:i})=>e.jsxs(p,{children:[e.jsx(s,{children:"Open Popover"}),e.jsx(n,{isOpen:t,hideArrow:a,placement:i,children:e.jsxs(P,{direction:"column",gap:"3",style:{width:"320px"},children:[e.jsx(r,{style:{fontWeight:"bold"},children:"Long Content Example"}),e.jsx(r,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(r,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(r,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}),e.jsx(r,{children:"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}),e.jsx(r,{children:"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."})]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <Text>This is a popover</Text>
  }
})`,...o.input.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    hideArrow: true
  }
})`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'top'
  }
})`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'right'
  }
})`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'bottom'
  }
})`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'left'
  }
})`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...g.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...f.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    offset: 20,
    placement: 'bottom'
  }
})`,...T.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...j.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...w.parameters?.docs?.source}}};const je=["Default","IsOpen","HideArrow","TopPlacement","RightPlacement","BottomPlacement","LeftPlacement","AllPlacements","AllPlacementsNoArrow","WithRichContent","CustomOffset","NonModal","WithLongContent"];export{g as AllPlacements,v as AllPlacementsNoArrow,x as BottomPlacement,T as CustomOffset,o as Default,m as HideArrow,c as IsOpen,h as LeftPlacement,j as NonModal,u as RightPlacement,d as TopPlacement,w as WithLongContent,f as WithRichContent,je as __namedExportsOrder};
