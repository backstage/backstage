import{j as t,W as d,a3 as u,a2 as h}from"./iframe-UdCk74ed.js";import{r as g}from"./plugin-CPSIGqce.js";import{S as l,u as n,a as x}from"./useSearchModal-qgorcDQc.js";import{B as c}from"./Button-CF71Je-k.js";import{D as S,a as f,b as M}from"./DialogTitle-BDb5suGJ.js";import{B as j}from"./Box-sbiym-y5.js";import{S as r}from"./Grid-DwqHvQ9E.js";import{S as C}from"./SearchType-DopFjr69.js";import{L as y}from"./List-CFWP97D4.js";import{H as I}from"./DefaultResultListItem-Qiz4oduq.js";import{w as R}from"./appWrappers-V-L692aw.js";import{m as B}from"./makeStyles-EOk-SryI.js";import{s as D,M as k}from"./api-ST6kqXaL.js";import{S as v}from"./SearchContext-Cv6UnX9N.js";import{SearchBar as T}from"./SearchBar-CvEf3voz.js";import{S as b}from"./SearchResult-DOzZYULa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWQJW2DZ.js";import"./Plugin-CwJz-7RT.js";import"./componentData-DfN_GEAU.js";import"./useAnalytics-DsUIDtns.js";import"./useApp-CPPq470-.js";import"./useRouteRef-ZbTjq9OE.js";import"./ArrowForward-BppNCfBW.js";import"./translation-uQxXzAMD.js";import"./Page-ClkNySDd.js";import"./useMediaQuery-ItKfx-g2.js";import"./Divider-CtW3oCa7.js";import"./ArrowBackIos-BKBjYjBq.js";import"./ArrowForwardIos-DCvL_-LK.js";import"./translation-B_8TqsHv.js";import"./Modal-88nru509.js";import"./Portal-B_bZnr3n.js";import"./Backdrop-BmrofSaL.js";import"./styled-BN87Jrul.js";import"./ExpandMore-DwTkoc5e.js";import"./useAsync-BWSDTMlV.js";import"./useMountedState-7chJbMUP.js";import"./AccordionDetails-DsLxbANW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dq_oeJyM.js";import"./ListItem-D0ITxQe3.js";import"./ListContext-C8Zyt_3h.js";import"./ListItemIcon-fBCHDIjQ.js";import"./ListItemText-C5Zs7Dtn.js";import"./Tabs-D8sjjNcG.js";import"./KeyboardArrowRight-DrZ4A9-2.js";import"./FormLabel-C8fbt-l2.js";import"./formControlState-DDtdeAfY.js";import"./InputLabel-CAWiZp1s.js";import"./Select-BPQdorpW.js";import"./Popover-CKDAusRL.js";import"./MenuItem-Dn2wl6H5.js";import"./Checkbox-BKZetU6d.js";import"./SwitchBase-B4cpjSI7.js";import"./Chip-ClK69h0e.js";import"./Link-DW5yfdOI.js";import"./index-BZAuc_Yo.js";import"./lodash-BPf5Z96Y.js";import"./WebStorage-z3VDyDN7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-NqXS6hss.js";import"./useIsomorphicLayoutEffect-C3V_u_Ax.js";import"./BUIProvider-DWM49Kjg.js";import"./openLink-CyZ-ce7w.js";import"./useResolvedHref-BspT5rIG.js";import"./Search-DXVHw8sw.js";import"./useDebounce-uTkOD-uz.js";import"./InputAdornment-DhRRpQKp.js";import"./TextField-D7ZSNfzi.js";import"./useElementFilter-B6wk_oaL.js";import"./EmptyState-GjaGgr4q.js";import"./Progress-BBoMN1-d.js";import"./LinearProgress-BMOSdfx4.js";import"./ResponseErrorPanel-CHUsG7MP.js";import"./ErrorPanel-BmaaGwBt.js";import"./WarningPanel-C960RCQm.js";import"./MarkdownContent-ULNUBQMW.js";import"./CodeSnippet-XL-2vNKw.js";import"./CopyTextButton-tqLqfB6x.js";import"./useCopyToClipboard-ByNVH3g5.js";import"./Tooltip-BMMZ8usS.js";import"./Popper-Ds0Kdlca.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
