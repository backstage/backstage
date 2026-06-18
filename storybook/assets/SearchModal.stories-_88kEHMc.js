import{bR as t,u as d,l as u,a5 as h}from"./iframe-BoHeIN98.js";import{r as g}from"./plugin-82UBDCLd.js";import{S as m,u as n,b as x}from"./useSearchModal-Cmmfgcsp.js";import{B as c}from"./Button-BDWSdStw.js";import{c as S,b as f,a as M}from"./DialogTitle-DbsZYmkS.js";import{B as j}from"./Box-S5ZWPiRH.js";import{S as r}from"./Grid-Vi-QfLwX.js";import{S as C}from"./SearchType-CmW40fNs.js";import{L as y}from"./List-2zDM7bk8.js";import{H as R}from"./DefaultResultListItem-BRVxpQR6.js";import{O as I}from"./appWrappers-DJHoW3YO.js";import{m as B}from"./makeStyles-ChrV0xkl.js";import{s as D,M as b}from"./api-BLZXQj8Y.js";import{S as k}from"./SearchContext-oNO94YrN.js";import{SearchBar as v}from"./SearchBar-BbuiGwWl.js";import{S as T}from"./SearchResult-DTg9IbR1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CT_UShKe.js";import"./Plugin-CkIfdWAy.js";import"./componentData-f-24HF9Q.js";import"./useAnalytics-Dx-eH7bg.js";import"./useApp-CgoYxTWd.js";import"./useRouteRef-lGm3-Wkr.js";import"./ArrowForward-NzPz-dvf.js";import"./translation-BmEMrCro.js";import"./Page-BEShiqFY.js";import"./useMediaQuery-UrWUoLKJ.js";import"./Divider-B9CDCtk4.js";import"./ArrowBackIos-BVZy-fgf.js";import"./ArrowForwardIos-YZNDYWvU.js";import"./translation-AuYuwDre.js";import"./Modal-OS18kCc8.js";import"./Portal-HQ-CMin5.js";import"./Backdrop-BZvaEXBC.js";import"./styled-gfsms5P7.js";import"./ExpandMore-DCkKE7p8.js";import"./useAsync-DSh_cgtj.js";import"./useMountedState-B0_hTaNv.js";import"./AccordionDetails-bGXmrZkh.js";import"./index-B9sM2jn7.js";import"./Collapse-h_NMVjtC.js";import"./ListItem-j6ZpAh7t.js";import"./ListContext-D1hfzYAi.js";import"./ListItemIcon-8CoaCB6P.js";import"./ListItemText-B8qu921C.js";import"./Tabs-Chsb18mo.js";import"./KeyboardArrowRight-Ds6f1ct8.js";import"./FormLabel-TexUx9xg.js";import"./formControlState-Ehni3xex.js";import"./InputLabel-DNvlvBUX.js";import"./Select-Dq0U6gLB.js";import"./Popover-a9xsBlnN.js";import"./MenuItem-Dc8AuHwE.js";import"./Checkbox-CPqza-_Z.js";import"./SwitchBase-Bu4G0YX5.js";import"./Chip-AJba0CXz.js";import"./Link-1dowOUr1.js";import"./index-DhR05N1l.js";import"./lodash-BtO-qHMp.js";import"./WebStorage-Hoe5HKIB.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-yB9X5TTO.js";import"./useIsomorphicLayoutEffect-Cty6nLQY.js";import"./BUIProvider-DDPA0RvA.js";import"./openLink-CzGsEk9E.js";import"./useResolvedHref-D2CCdNlh.js";import"./Search-CdTCo8GO.js";import"./useDebounce-BNNfLfGg.js";import"./InputAdornment-68t_Xcsu.js";import"./TextField-B1iVATrJ.js";import"./useElementFilter-BINl71ds.js";import"./EmptyState-CYscZSSe.js";import"./Progress-ncZrfz_Z.js";import"./LinearProgress-D6Ea18s8.js";import"./ResponseErrorPanel-CGgBIaLj.js";import"./ErrorPanel-BD6ZWBx3.js";import"./WarningPanel-D5gLREAr.js";import"./MarkdownContent-B5s0VngN.js";import"./CodeSnippet-3xzrq7ws.js";import"./CopyTextButton-DEIo5_IO.js";import"./useCopyToClipboard-DawLmkoZ.js";import"./Tooltip-Bsc8dTPW.js";import"./Popper-F8TWKpZp.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
