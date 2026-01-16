import{j as o}from"./iframe-C6d4amxQ.js";import{c as e}from"./plugin-DFI2I8hq.js";import{S as l}from"./Grid-WtUylni-.js";import{C as m}from"./ComponentAccordion-DuVyWg3c.js";import{w as a}from"./appWrappers-BuwXBYCY.js";import{T as i}from"./TemplateBackstageLogoIcon-KnYNDDak.js";import{I as s}from"./InfoCard-CgJKC6GU.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-C7MtdO6s.js";import"./componentData-BhUIek-Q.js";import"./useAnalytics-CEJvE44e.js";import"./useApp-BUIf5wuk.js";import"./useRouteRef-D7G3Qpmz.js";import"./index-Bwu9Fyg1.js";import"./DialogTitle-C6vJC5fn.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./Backdrop-DBUbh-8q.js";import"./Button-Cu6BkngO.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./ExpandMore--4wftT15.js";import"./AccordionDetails-BgOvrYOY.js";import"./index-B9sM2jn7.js";import"./Collapse-Di3lEKwf.js";import"./useAsync-C2weF2sY.js";import"./useMountedState-C6W4VPdE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Bw4RFqsT.js";import"./ErrorBoundary-C3nTIgGK.js";import"./ErrorPanel-C4TycXbx.js";import"./WarningPanel-C-jRLCTC.js";import"./MarkdownContent-BYJW4Slr.js";import"./CodeSnippet-3cP_Pubp.js";import"./Box-yXRZ3Xp2.js";import"./styled-BGGy5Grm.js";import"./CopyTextButton-CE5xtLZ0.js";import"./useCopyToClipboard-CH_VlaT9.js";import"./Tooltip-5RhOkenH.js";import"./Popper-aoUur9H0.js";import"./List-qMmGjvCV.js";import"./ListContext-Baa1QRS6.js";import"./ListItem-CUGV6Izn.js";import"./ListItemText-DmvyJhay.js";import"./LinkButton-BQkTZkOF.js";import"./Link-xhhwyYCu.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-C9AdOzcV.js";import"./Divider-BlWYsQ2U.js";import"./CardActions-5fjFai41.js";import"./BottomLink-DxVrnvh5.js";import"./ArrowForward-CERyzcOO.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
