import{j as o}from"./iframe-BKfEGE7G.js";import{c as e}from"./plugin-BOqA5qbY.js";import{S as l}from"./Grid-vX9qBbX0.js";import{C as m}from"./ComponentAccordion-d7IsiXow.js";import{w as a}from"./appWrappers-BhL0UeRU.js";import{T as i}from"./TemplateBackstageLogoIcon-Dpknz8_Q.js";import{I as s}from"./InfoCard-BPOeB8Dc.js";import"./preload-helper-D9Z9MdNV.js";import"./Plugin-CmKCshsM.js";import"./componentData-MugjuQjt.js";import"./useAnalytics-BLOfhO-l.js";import"./useApp-_11zMdcF.js";import"./useRouteRef-B__3vLRT.js";import"./index-DxVjIFhW.js";import"./DialogTitle-COtGSIrZ.js";import"./Modal-CvEZPVbb.js";import"./Portal-Dl4iECMi.js";import"./Backdrop-TvGNQn7O.js";import"./Button-CBt-BxVf.js";import"./useObservable-1flBwXTR.js";import"./ExpandMore-Bf4tz0ks.js";import"./AccordionDetails-DO5qN2es.js";import"./index-DnL3XN75.js";import"./Collapse-Bj6_bX8n.js";import"./useAsync-DF0QzlTM.js";import"./useMountedState-Bzk_h1H1.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-DrXXBE5X.js";import"./ErrorBoundary-DggD4pwq.js";import"./ErrorPanel-D0Z-D0YB.js";import"./WarningPanel-BmLRnDjl.js";import"./MarkdownContent-BbcMZHtE.js";import"./CodeSnippet-4N0YB7qg.js";import"./Box-BJlQ2iQy.js";import"./styled-B4-rL4TL.js";import"./CopyTextButton-_rHychZO.js";import"./useCopyToClipboard-By-88AN1.js";import"./Tooltip-BkpGifwK.js";import"./Popper-Cl6P73dl.js";import"./List-xqk2zBI-.js";import"./ListContext-1tRnwUCo.js";import"./ListItem-DH54cTxL.js";import"./ListItemText-DfnmZGrz.js";import"./LinkButton-Dp8nvFiv.js";import"./Link-CDMP9pev.js";import"./lodash-CwBbdt2Q.js";import"./CardHeader-pOr2jc7f.js";import"./Divider-B7pMmKOl.js";import"./CardActions-D1j0vYEk.js";import"./BottomLink-DpbJPqBE.js";import"./ArrowForward-BWmuSl5e.js";const so={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...t.parameters?.docs?.source}}};const co=["Default","InAccordion"];export{r as Default,t as InAccordion,co as __namedExportsOrder,so as default};
