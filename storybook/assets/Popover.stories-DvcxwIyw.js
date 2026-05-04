import{j as e,B as w,p as b}from"./iframe-COJz9F1o.js";import{P as n}from"./Popover-Boj8PktP.js";import{B as i}from"./Button-q3lkHD0X.js";import{D as p}from"./Dialog-C0_eNzOX.js";import{T as t}from"./Text-B-mK5mWm.js";import{F as j}from"./Flex-Dx7nnyxH.js";import"./preload-helper-PPVm8Dsz.js";import"./useObjectRef-BVWhO1QJ.js";import"./useOverlayTriggerState-D6IJfzW1.js";import"./utils-Ca8VRlnk.js";import"./useGlobalListeners-B-mHHtEE.js";import"./openLink-D-7XJ3Oc.js";import"./number-DOpROmP3.js";import"./I18nProvider-Cix8lVYp.js";import"./useControlledState-CYGiTDAh.js";import"./Dialog-DFM5S7cL.js";import"./Button-D6Mw4SOw.js";import"./Label-Bje3-SKc.js";import"./Hidden-BUcIqtcd.js";import"./useLabel-CzB85gF3.js";import"./useLabels-DX3CMU8G.js";import"./useButton-BjPKXG4Y.js";import"./usePress-DKjqoiSZ.js";import"./textSelection-B1xIHbhq.js";import"./useHover-d8OYsWaB.js";import"./Heading-C5WiFkYc.js";import"./useCollection-BOqwRVgc.js";import"./keyboard-DtR6oH2F.js";import"./FocusScope-hw_VMdoM.js";import"./useEvent-ptp_askm.js";import"./Autocomplete-BXjco31v.js";import"./useLocalizedStringFormatter-Uk8SorkE.js";import"./getItemCount-Cf5ynn4r.js";import"./Text-Dur_mw8s.js";import"./VisuallyHidden-D8GUlp6B.js";import"./animation-Chfeuq0j.js";import"./definition-BZTqucgV.js";import"./index-C7YuSWIQ.js";const A=b.meta({title:"Backstage UI/Popover",component:n,parameters:{layout:"centered"},argTypes:{isOpen:{control:{type:"boolean"}},hideArrow:{control:{type:"boolean"}},placement:{control:{type:"select"},options:["top","top start","top end","bottom","bottom start","bottom end","left","left start","left end","right","right start","right end"]},offset:{control:{type:"number"}}},render:({children:r,isOpen:a,hideArrow:s,placement:P,offset:q})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Popover"}),e.jsx(n,{isOpen:a,hideArrow:s,placement:P,offset:q,children:r??e.jsx(t,{children:"This is a popover"})})]})}),o=A.story({args:{children:e.jsx(t,{children:"This is a popover"})}}),l=o.extend({parameters:{layout:"fullscreen"},decorators:[r=>e.jsx("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:"radial-gradient(circle, var(--bui-border-1) 1px, transparent 1px)",backgroundSize:"16px 16px"},children:e.jsx(r,{})})],args:{isOpen:!0}}),c=o.extend({args:{isOpen:!0,hideArrow:!0}}),m=o.extend({args:{isOpen:!0,placement:"top"}}),u=o.extend({args:{isOpen:!0,placement:"right"}}),d=o.extend({args:{isOpen:!0,placement:"bottom"}}),x=o.extend({args:{isOpen:!0,placement:"left"}}),h=o.extend({parameters:{controls:{exclude:["placement"]}},args:{isOpen:!0},render:({isOpen:r,hideArrow:a})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Popovers"}),e.jsx(n,{isOpen:r,placement:"top",hideArrow:a,children:e.jsx(t,{children:"Top placement"})}),e.jsx(n,{isOpen:r,placement:"right",hideArrow:a,children:e.jsx(t,{children:"Right placement"})}),e.jsx(n,{isOpen:r,placement:"bottom",hideArrow:a,children:e.jsx(t,{children:"Bottom placement"})}),e.jsx(n,{isOpen:r,placement:"left",hideArrow:a,children:e.jsx(t,{children:"Left placement"})})]})}),g=o.extend({parameters:{controls:{exclude:["placement","hideArrow"]}},args:{isOpen:!0,hideArrow:!0},render:({isOpen:r})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Popovers"}),e.jsx(n,{isOpen:r,placement:"top",hideArrow:!0,children:e.jsx(t,{children:"Top placement"})}),e.jsx(n,{isOpen:r,placement:"right",hideArrow:!0,children:e.jsx(t,{children:"Right placement"})}),e.jsx(n,{isOpen:r,placement:"bottom",hideArrow:!0,children:e.jsx(t,{children:"Bottom placement"})}),e.jsx(n,{isOpen:r,placement:"left",hideArrow:!0,children:e.jsx(t,{children:"Left placement"})})]})}),v=o.extend({args:{isOpen:!0},render:({isOpen:r,hideArrow:a,placement:s})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Popover"}),e.jsx(n,{isOpen:r,hideArrow:a,placement:s,children:e.jsxs(j,{direction:"column",gap:"3",style:{width:"280px"},children:[e.jsx(t,{style:{fontWeight:"bold"},children:"Popover Title"}),e.jsx(t,{children:"This is a popover with rich content. It can contain multiple elements and formatted text."}),e.jsx(w,{bg:"neutral",p:"2",children:e.jsx(t,{children:"You can also use the automatic bg system inside it."})}),e.jsxs(j,{gap:"2",justify:"end",children:[e.jsx(i,{variant:"tertiary",size:"small",children:"Cancel"}),e.jsx(i,{variant:"primary",size:"small",children:"Confirm"})]})]})})]})}),f=o.extend({args:{isOpen:!0,offset:20,placement:"bottom"}}),T=o.extend({args:{isOpen:!0},render:({isOpen:r,hideArrow:a,placement:s})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Non-Modal Popover"}),e.jsx(n,{isOpen:r,hideArrow:a,placement:s,isNonModal:!0,children:e.jsx(t,{children:"This is a non-modal popover. You can interact with other elements on the page while it's open."})})]})}),O=o.extend({args:{isOpen:!0},render:({isOpen:r,hideArrow:a,placement:s})=>e.jsxs(p,{children:[e.jsx(i,{children:"Open Popover"}),e.jsx(n,{isOpen:r,hideArrow:a,placement:s,children:e.jsxs(j,{direction:"column",gap:"3",style:{width:"320px"},children:[e.jsx(t,{style:{fontWeight:"bold"},children:"Long Content Example"}),e.jsx(t,{children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}),e.jsx(t,{children:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}),e.jsx(t,{children:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}),e.jsx(t,{children:"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."}),e.jsx(t,{children:"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."})]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    children: <Text>This is a popover</Text>
  }
})`,...o.input.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    hideArrow: true
  }
})`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'top'
  }
})`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'right'
  }
})`,...u.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'bottom'
  }
})`,...d.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    placement: 'left'
  }
})`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...g.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...v.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`Default.extend({
  args: {
    isOpen: true,
    offset: 20,
    placement: 'bottom'
  }
})`,...f.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...T.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`Default.extend({
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
})`,...O.parameters?.docs?.source}}};const me=["Default","IsOpen","HideArrow","TopPlacement","RightPlacement","BottomPlacement","LeftPlacement","AllPlacements","AllPlacementsNoArrow","WithRichContent","CustomOffset","NonModal","WithLongContent"];export{h as AllPlacements,g as AllPlacementsNoArrow,d as BottomPlacement,f as CustomOffset,o as Default,c as HideArrow,l as IsOpen,x as LeftPlacement,T as NonModal,u as RightPlacement,m as TopPlacement,O as WithLongContent,v as WithRichContent,me as __namedExportsOrder};
