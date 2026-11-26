import{j as e,B as A,p as T}from"./iframe-7sCYbwMA.js";import{A as t}from"./Alert-BfaDIbB7.js";import{T as w}from"./index-DXJUlwCm.js";import{F as n}from"./Flex-CmyHw2X8.js";import{B as r}from"./Button-BRiFRA6Z.js";import{T as i}from"./Text-zdsrOI4J.js";import"./preload-helper-PPVm8Dsz.js";import"./Button-DGrW_YAy.js";import"./utils-9GxVsiDp.js";import"./useObjectRef-B-PPvPC_.js";import"./Label-LRQoVPax.js";import"./Hidden-CI0OECmE.js";import"./useFocusRing-DtQAi71R.js";import"./useLabel-BFjYAAvj.js";import"./useLabels-BJlFaWLE.js";import"./number-D8Tvkt0y.js";import"./I18nProvider-CNZdU0-i.js";import"./useButton-Drv-lwD1.js";import"./usePress-CQso2Ktw.js";import"./textSelection-oDhLNlBr.js";import"./getMetaValue-BOiM-Q3U.js";import"./useHover-Bvne2y_8.js";const s=T.meta({title:"Backstage UI/Alert",component:t,argTypes:{status:{control:"select",options:["info","success","warning","danger"]},icon:{control:"boolean"},isPending:{control:"boolean"}}}),a=s.story({args:{title:"This is an alert message",icon:!0}}),c=s.story({args:{title:"This is an alert message"},parameters:{argTypes:{status:{control:!1}}},render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"This is an informational alert with helpful information."}),e.jsx(t,{status:"success",icon:!0,title:"Your changes have been saved successfully."}),e.jsx(t,{status:"warning",icon:!0,title:"This action may have unintended consequences."}),e.jsx(t,{status:"danger",icon:!0,title:"An error occurred while processing your request."})]})}),u=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"New Feature Available",description:"We've added support for custom table columns. Check the documentation to learn more."}),e.jsx(t,{status:"success",icon:!0,title:"Deployment Successful",description:"Your application has been deployed to production. All health checks passed."}),e.jsx(t,{status:"warning",icon:!0,title:"Pending Review",description:"Please review the following items before proceeding with the deployment."}),e.jsx(t,{status:"danger",icon:!0,title:"Authentication Failed",description:"Unable to verify your credentials. Please check your username and password and try again."})]})}),l=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!1,title:"This is an informational alert without an icon."}),e.jsx(t,{status:"success",icon:!1,title:"Your changes have been saved successfully."}),e.jsx(t,{status:"warning",icon:!1,title:"This action may have unintended consequences."}),e.jsx(t,{status:"danger",icon:!1,title:"An error occurred while processing your request."})]})}),d=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:e.jsx(w,{"aria-hidden":"true"}),title:"This alert uses a custom cloud icon instead of the default info icon."}),e.jsx(t,{status:"success",icon:e.jsx(w,{"aria-hidden":"true"}),title:"Custom icons work with any status variant."})]})}),o=s.story({render:j=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"This alert has a dismiss action on the right.",customActions:e.jsx(r,{size:"small",variant:"tertiary",children:"Dismiss"}),...j}),e.jsx(t,{status:"success",icon:!0,title:"Your changes have been saved. Would you like to continue?",customActions:e.jsxs(e.Fragment,{children:[e.jsx(r,{size:"small",variant:"tertiary",children:"Cancel"}),e.jsx(r,{size:"small",variant:"primary",children:"Continue"})]}),...j}),e.jsx(t,{status:"danger",icon:!0,title:"An error occurred while processing your request. Please try again.",customActions:e.jsx(r,{size:"small",variant:"primary",children:"Retry"}),...j})]})}),p=o.extend({args:{description:"This is a description of the alert."}}),m=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(i,{children:"Info"}),e.jsx(t,{status:"info",icon:!0,isPending:!0,title:"Processing your request..."}),e.jsx(i,{children:"Success"}),e.jsx(t,{status:"success",icon:!0,isPending:!0,title:"Saving changes..."}),e.jsx(i,{children:"Warning"}),e.jsx(t,{status:"warning",icon:!0,isPending:!0,title:"Checking for issues..."}),e.jsx(i,{children:"Danger"}),e.jsx(t,{status:"danger",icon:!0,isPending:!0,title:"Attempting recovery..."})]})}),g=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!0,isPending:!0,title:"Processing your request",description:"This may take a few moments. Please do not close this window."}),e.jsx(t,{status:"success",icon:!0,isPending:!0,title:"Deployment in Progress",description:"Your application is being deployed to production. You'll receive a notification when complete."})]})}),h=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary."}),e.jsx(t,{status:"warning",icon:!0,title:"This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length.",customActions:e.jsx(r,{size:"small",variant:"tertiary",children:"Dismiss"})})]})}),x=s.story({render:()=>e.jsxs(n,{direction:"column",gap:"4",children:[e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(i,{children:"Default"}),e.jsxs(n,{direction:"column",gap:"2",p:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"Alert on default bg"}),e.jsx(t,{status:"success",icon:!0,title:"Alert on default bg"})]})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(i,{children:"On Neutral 1"}),e.jsxs(n,{direction:"column",gap:"2",bg:"neutral",p:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"Alert on neutral-1"}),e.jsx(t,{status:"success",icon:!0,title:"Alert on neutral-1"})]})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(i,{children:"On Neutral 2"}),e.jsx(A,{bg:"neutral",children:e.jsxs(n,{direction:"column",gap:"2",bg:"neutral",p:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"Alert on neutral-2"}),e.jsx(t,{status:"success",icon:!0,title:"Alert on neutral-2"})]})})]}),e.jsxs(n,{direction:"column",gap:"4",children:[e.jsx(i,{children:"On Neutral 3"}),e.jsx(A,{bg:"neutral",children:e.jsx(A,{bg:"neutral",children:e.jsxs(n,{direction:"column",gap:"2",bg:"neutral",p:"4",children:[e.jsx(t,{status:"info",icon:!0,title:"Alert on neutral-3"}),e.jsx(t,{status:"success",icon:!0,title:"Alert on neutral-3"})]})})})]})]})}),f=s.story({args:{title:"This alert changes status responsively",icon:!0,status:{initial:"info",sm:"success",md:"warning",lg:"danger"}}}),y=s.story({render:()=>e.jsxs(A,{bg:"neutral",py:"4",children:[e.jsx(t,{status:"success",icon:!0,title:"Alert with custom margin",mb:"4",mx:"4"}),e.jsx(t,{status:"success",icon:!0,title:"Alert with custom margin",mx:"4"})]})});a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This is an alert message',
    icon: true
  }
})`,...a.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This is an alert message'
  },
  parameters: {
    argTypes: {
      status: {
        control: false
      }
    }
  },
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This is an informational alert with helpful information." />
      <Alert status="success" icon={true} title="Your changes have been saved successfully." />
      <Alert status="warning" icon={true} title="This action may have unintended consequences." />
      <Alert status="danger" icon={true} title="An error occurred while processing your request." />
    </Flex>
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="New Feature Available" description="We've added support for custom table columns. Check the documentation to learn more." />
      <Alert status="success" icon={true} title="Deployment Successful" description="Your application has been deployed to production. All health checks passed." />
      <Alert status="warning" icon={true} title="Pending Review" description="Please review the following items before proceeding with the deployment." />
      <Alert status="danger" icon={true} title="Authentication Failed" description="Unable to verify your credentials. Please check your username and password and try again." />
    </Flex>
})`,...u.input.parameters?.docs?.source}}};l.input.parameters={...l.input.parameters,docs:{...l.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={false} title="This is an informational alert without an icon." />
      <Alert status="success" icon={false} title="Your changes have been saved successfully." />
      <Alert status="warning" icon={false} title="This action may have unintended consequences." />
      <Alert status="danger" icon={false} title="An error occurred while processing your request." />
    </Flex>
})`,...l.input.parameters?.docs?.source}}};d.input.parameters={...d.input.parameters,docs:{...d.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={<RiCloudLine aria-hidden="true" />} title="This alert uses a custom cloud icon instead of the default info icon." />
      <Alert status="success" icon={<RiCloudLine aria-hidden="true" />} title="Custom icons work with any status variant." />
    </Flex>
})`,...d.input.parameters?.docs?.source}}};o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  render: args => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This alert has a dismiss action on the right." customActions={<Button size="small" variant="tertiary">
            Dismiss
          </Button>} {...args} />
      <Alert status="success" icon={true} title="Your changes have been saved. Would you like to continue?" customActions={<>
            <Button size="small" variant="tertiary">
              Cancel
            </Button>
            <Button size="small" variant="primary">
              Continue
            </Button>
          </>} {...args} />
      <Alert status="danger" icon={true} title="An error occurred while processing your request. Please try again." customActions={<Button size="small" variant="primary">
            Retry
          </Button>} {...args} />
    </Flex>
})`,...o.input.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`WithActions.extend({
  args: {
    description: 'This is a description of the alert.'
  }
})`,...p.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Text>Info</Text>
      <Alert status="info" icon={true} isPending title="Processing your request..." />

      <Text>Success</Text>
      <Alert status="success" icon={true} isPending title="Saving changes..." />

      <Text>Warning</Text>
      <Alert status="warning" icon={true} isPending title="Checking for issues..." />

      <Text>Danger</Text>
      <Alert status="danger" icon={true} isPending title="Attempting recovery..." />
    </Flex>
})`,...m.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} isPending title="Processing your request" description="This may take a few moments. Please do not close this window." />
      <Alert status="success" icon={true} isPending title="Deployment in Progress" description="Your application is being deployed to production. You'll receive a notification when complete." />
    </Flex>
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Alert status="info" icon={true} title="This is a longer alert message that demonstrates how the component handles multiple lines of text. The content will wrap naturally and maintain proper spacing with the icon and any actions. This is useful for providing detailed information to users when necessary." />
      <Alert status="warning" icon={true} title="This alert combines long content with actions. The actions remain aligned to the right even when the content wraps to multiple lines. This ensures a consistent and predictable layout regardless of content length." customActions={<Button size="small" variant="tertiary">
            Dismiss
          </Button>} />
    </Flex>
})`,...h.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Flex direction="column" gap="4">
      <Flex direction="column" gap="4">
        <Text>Default</Text>
        <Flex direction="column" gap="2" p="4">
          <Alert status="info" icon={true} title="Alert on default bg" />
          <Alert status="success" icon={true} title="Alert on default bg" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Neutral 1</Text>
        <Flex direction="column" gap="2" bg="neutral" p="4">
          <Alert status="info" icon={true} title="Alert on neutral-1" />
          <Alert status="success" icon={true} title="Alert on neutral-1" />
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Neutral 2</Text>
        <Box bg="neutral">
          <Flex direction="column" gap="2" bg="neutral" p="4">
            <Alert status="info" icon={true} title="Alert on neutral-2" />
            <Alert status="success" icon={true} title="Alert on neutral-2" />
          </Flex>
        </Box>
      </Flex>

      <Flex direction="column" gap="4">
        <Text>On Neutral 3</Text>
        <Box bg="neutral">
          <Box bg="neutral">
            <Flex direction="column" gap="2" bg="neutral" p="4">
              <Alert status="info" icon={true} title="Alert on neutral-3" />
              <Alert status="success" icon={true} title="Alert on neutral-3" />
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
})`,...x.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'This alert changes status responsively',
    icon: true,
    status: {
      initial: 'info',
      sm: 'success',
      md: 'warning',
      lg: 'danger'
    }
  }
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  render: () => <Box bg="neutral" py="4">
      <Alert status="success" icon={true} title="Alert with custom margin" mb="4" mx="4" />
      <Alert status="success" icon={true} title="Alert with custom margin" mx="4" />
    </Box>
})`,...y.input.parameters?.docs?.source}}};const G=["Default","StatusVariants","WithDescription","WithoutIcons","CustomIcon","WithActions","WithActionsAndDescriptions","PendingVariants","PendingWithDescription","LongContent","OnDifferentBackgrounds","Responsive","WithUtilityProps"];export{d as CustomIcon,a as Default,h as LongContent,x as OnDifferentBackgrounds,m as PendingVariants,g as PendingWithDescription,f as Responsive,c as StatusVariants,o as WithActions,p as WithActionsAndDescriptions,u as WithDescription,y as WithUtilityProps,l as WithoutIcons,G as __namedExportsOrder};
