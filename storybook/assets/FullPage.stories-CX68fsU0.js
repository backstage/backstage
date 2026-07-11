import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-COykYx45.js";import{P as l}from"./PluginHeader-DyojpIq5.js";import{C as p}from"./Container-BV1M41qh.js";import{T as t}from"./Text-Cyy7dPnV.js";import{B as j}from"./BUIProvider-C1SLyjta.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C2j_KLnZ.js";import"./utils-ijm_b3mJ.js";import"./useObjectRef-CMiC6ke_.js";import"./useCollection-CdVfx8jU.js";import"./useFocusRing-Bjvn0GS4.js";import"./openLink-DVwmAOKC.js";import"./Hidden-BsQlbI9F.js";import"./keyboard-C7oGs8Ux.js";import"./FocusScope-4bHQ4WF-.js";import"./useEvent-Dn5dWHRg.js";import"./I18nProvider-DL1Ps6Ca.js";import"./usePress-C3UrLlH7.js";import"./textSelection-BToKgSXC.js";import"./useControlledState-CjsdyDjY.js";import"./Link-Cj4NOwbC.js";import"./useLink-Cjb7pOwV.js";import"./useHover-gDb7vOkJ.js";import"./useLocalizedStringFormatter-BGJNBy6y.js";import"./Button-Bito0oFe.js";import"./Label--YQs_5DF.js";import"./useLabel-PGKREU8T.js";import"./useLabels-Cpdv89rG.js";import"./number-B3izyAdU.js";import"./useButton-rnhRQmzJ.js";import"./Menu-DAlH-068.js";import"./Autocomplete-BCll0Usm.js";import"./getItemCount-BTil1_1B.js";import"./Input-ye45j2AX.js";import"./ListBox-DM8wv16H.js";import"./Text-slD25mVU.js";import"./useListState-CZzGAJgT.js";import"./Dialog-DuxVYgUJ.js";import"./Heading-CjfE-IUi.js";import"./useOverlayTriggerState-BkDz7Lrc.js";import"./VisuallyHidden-OeS3fhJT.js";import"./animation-By8SMLky.js";import"./SearchField-CU8pFK3h.js";import"./FieldError-BP5SOq7I.js";import"./useFormValidation-DaDBy4-y.js";import"./useTextField-afr60wi8.js";import"./useField-Capgz0XH.js";import"./useFormReset-DHQFUW9B.js";import"./Virtualizer-CD0Ht6Ts.js";import"./useFilter-CW83bmhz.js";import"./getNodeText-DQiZsXeD.js";import"./Link-Cz0bbsoU.js";import"./useResolvedHref-B4mcLcl5.js";import"./Tooltip-BOZftJPl.js";import"./VisuallyHidden-D9H1hnGE.js";import"./Tabs-Cc926dJ8.js";import"./useHasTabbableChild-CtlELOu8.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
