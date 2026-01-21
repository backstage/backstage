import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DfW0k9e4.js";import{s as g,H as u}from"./plugin-BPZzyoGP.js";import{c as h}from"./api-2FeSlKic.js";import{c as f}from"./catalogApiMock-BXElzt0I.js";import{s as x}from"./api-BKW6umIp.js";import{S as y}from"./SearchContext-DPWQU3kL.js";import{P as S}from"./Page-BMgGwctg.js";import{S as r}from"./Grid-DOkM8E58.js";import{b as k,a as j,c as C}from"./plugin-C2W4X8kV.js";import{T as P}from"./TemplateBackstageLogo-BPFMgHvQ.js";import{T}from"./TemplateBackstageLogoIcon-C47fXrX8.js";import{e as I}from"./routes-BVFL3Ayb.js";import{w as v}from"./appWrappers-Bey6bAOs.js";import{s as G}from"./StarredEntitiesApi-C9k0U4Z-.js";import{M as A}from"./MockStarredEntitiesApi-LBB2tXqS.js";import{I as B}from"./InfoCard-AOVHQz_Y.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BmwIVKC2.js";import"./Plugin-CujPLxPN.js";import"./componentData-AJopfss2.js";import"./useAnalytics-BnjriHJi.js";import"./useApp-BXmyl95T.js";import"./useRouteRef-CckqiBtY.js";import"./index-Gw3tDiAb.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-CE87cvV8.js";import"./useMountedState-qW-VDUVJ.js";import"./DialogTitle-CE2AHhUw.js";import"./Modal-B6gsZuYb.js";import"./Portal-D7dEWwg8.js";import"./Backdrop-BGOjf9vo.js";import"./Button-Fr0OfS-w.js";import"./useObservable-DVRVcpuV.js";import"./useIsomorphicLayoutEffect--dLzM9RT.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C_v1HCxv.js";import"./ErrorBoundary-QuxMpnIx.js";import"./ErrorPanel-BMIN-fu2.js";import"./WarningPanel-BP-y6z0y.js";import"./ExpandMore-DgZ6UNBD.js";import"./AccordionDetails-B314eioH.js";import"./index-B9sM2jn7.js";import"./Collapse-kvPWdbht.js";import"./MarkdownContent-DX3OAbaQ.js";import"./CodeSnippet--VZdTbP8.js";import"./Box-D0zAdjf6.js";import"./styled-CReYHJ7K.js";import"./CopyTextButton-BDBeSRds.js";import"./useCopyToClipboard-DOwrP97-.js";import"./Tooltip-DzakseTW.js";import"./Popper-B4DyDbOp.js";import"./List-B3BEM4nz.js";import"./ListContext-hwCl85Z0.js";import"./ListItem-Bw1vw_JI.js";import"./ListItemText-IHJkJ5se.js";import"./LinkButton-BvSq_KJp.js";import"./Link-BloAuSmB.js";import"./CardHeader-BEXtfers.js";import"./Divider-CYGCiMiq.js";import"./CardActions-D-jrTd0z.js";import"./BottomLink-DRktrqa9.js";import"./ArrowForward-Cz23y3ha.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
