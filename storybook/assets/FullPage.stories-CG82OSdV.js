import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-Bep9_wBM.js";import{P as l}from"./PluginHeader-DpZc7YlP.js";import{C as p}from"./Container-DgqEf66q.js";import{T as t}from"./Text-BofD9AVk.js";import{B as j}from"./BUIProvider-dkMaKCFj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-tx8xlZoJ.js";import"./utils-DKKUPgM-.js";import"./useObjectRef-BMeF5lvf.js";import"./useCollection-BavV2Nde.js";import"./useFocusRing-E1AuPNx9.js";import"./openLink-DRfzd4-2.js";import"./Hidden-oYhCQ5Lr.js";import"./keyboard-CUlyN15g.js";import"./FocusScope-C_MYe5zM.js";import"./useEvent-67yxp7d3.js";import"./I18nProvider-7dRPeGho.js";import"./usePress-vAS4agaY.js";import"./textSelection-DySWx5du.js";import"./useControlledState-B2mYurZ2.js";import"./Link-aZvkYHvp.js";import"./useLink-BKqubru1.js";import"./useHover-DE1qWbCW.js";import"./useLocalizedStringFormatter-mkayHLXh.js";import"./Button-C3UUENf1.js";import"./Label-CXp4l2Zb.js";import"./useLabel-BiWRb2jR.js";import"./useLabels-BH6rqbM3.js";import"./number-VxDrHCY-.js";import"./useButton-0kbhVXvj.js";import"./Menu-CvfIMc3x.js";import"./Autocomplete-BXs_0ks3.js";import"./getItemCount-_QZQZcAU.js";import"./Input-DNjM_x5h.js";import"./ListBox-BBE0Hsl8.js";import"./Text-BGZzKR-G.js";import"./useListState-CE3Qd9aw.js";import"./Dialog-CyckqERW.js";import"./Heading-Bgxo1Fus.js";import"./useOverlayTriggerState-Bb7OtJVc.js";import"./VisuallyHidden-DgCl88eH.js";import"./animation-DqvQk7gj.js";import"./SearchField-DfeDRkpE.js";import"./FieldError-PsYucoOR.js";import"./useFormValidation-DQVcjs21.js";import"./useTextField-CaarGrBO.js";import"./useField-pYHkB-lT.js";import"./useFormReset-mbGsMuFn.js";import"./Virtualizer-AI-V7CTN.js";import"./useFilter-C7NlaC5C.js";import"./getNodeText-Cr84swQm.js";import"./Link-B5aVaxX4.js";import"./useResolvedHref-DTL4x9Ct.js";import"./Tooltip-CR5J2eBR.js";import"./VisuallyHidden-C0qlMmlr.js";import"./Tabs-DQSrt-IH.js";import"./useHasTabbableChild-B48hmY0j.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
