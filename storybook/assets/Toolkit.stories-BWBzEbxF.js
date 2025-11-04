import{j as o}from"./iframe-CuO26Rmv.js";import{c as e}from"./plugin-Bq6hyHXs.js";import{S as l}from"./Grid-BfYuvVEF.js";import{C as m}from"./ComponentAccordion-GoE0ij-y.js";import{w as a}from"./appWrappers-CqMB6nNx.js";import{T as i}from"./TemplateBackstageLogoIcon-Cqqr2WH6.js";import{I as s}from"./InfoCard-ChGG-MHI.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-BYJQvkSS.js";import"./componentData-jPnjY360.js";import"./useAnalytics-CdEHywY9.js";import"./useApp-BYLVa0iu.js";import"./useRouteRef-DasU4rh5.js";import"./index-CA92LH--.js";import"./DialogTitle-HF8aA2AY.js";import"./Modal-6Ajkd_zG.js";import"./Portal-BcfglCa0.js";import"./Backdrop-BlG2t9Br.js";import"./Button-DlZ0BBap.js";import"./useObservable-CW3YJiyR.js";import"./useIsomorphicLayoutEffect-B9jQ_lJC.js";import"./ExpandMore-BXwwuksY.js";import"./AccordionDetails-C3hb9ppk.js";import"./index-DnL3XN75.js";import"./Collapse-BQbZuamb.js";import"./useAsync-CNdJisKf.js";import"./useMountedState-Cwi1zouP.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-r0f801Ql.js";import"./ErrorBoundary-CFcBk-1U.js";import"./ErrorPanel-CDwA38MB.js";import"./WarningPanel-DSWSSSeS.js";import"./MarkdownContent-Dnni9t_T.js";import"./CodeSnippet-jcNnShuM.js";import"./Box-CU-U4ibu.js";import"./styled-C8K_EIFt.js";import"./CopyTextButton-BNZ4H3Xn.js";import"./useCopyToClipboard-BtizGtOb.js";import"./Tooltip-DqE-hoU6.js";import"./Popper-DfJjIkwB.js";import"./List-BAIPzTEx.js";import"./ListContext-0ULPV768.js";import"./ListItem-D5_amKXt.js";import"./ListItemText-CSVSzb3y.js";import"./LinkButton-5IaBbqVW.js";import"./Link-DPuqs8WZ.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-v7Sk4_UR.js";import"./Divider-vqslFKyv.js";import"./CardActions-NkzIkcmB.js";import"./BottomLink-DZSMcwn-.js";import"./ArrowForward-BT_Xitdy.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
