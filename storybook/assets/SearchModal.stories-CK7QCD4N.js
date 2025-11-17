import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DQwDoo1H.js";import{r as x}from"./plugin-BapKG4_G.js";import{S as m,u as n,a as S}from"./useSearchModal-DQpZjtsd.js";import{B as c}from"./Button-DxB0Mkn2.js";import{a as f,b as M,c as j}from"./DialogTitle-BfXc2ZX9.js";import{B as C}from"./Box-8SFFKrct.js";import{S as r}from"./Grid-C1mkfO-A.js";import{S as y}from"./SearchType-jk4hcNbk.js";import{L as I}from"./List-mWa-4ocl.js";import{H as R}from"./DefaultResultListItem-CKgymqs5.js";import{s as B,M as D}from"./api-C4Z_JmYp.js";import{S as T}from"./SearchContext-BBfS9AlB.js";import{w as k}from"./appWrappers-DVOHFJoQ.js";import{SearchBar as v}from"./SearchBar-DhE3Bkz6.js";import{a as b}from"./SearchResult-nDhJ2lQI.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BSAtJ84z.js";import"./Plugin-CD-n_nwk.js";import"./componentData-CtVPpLvp.js";import"./useAnalytics-CM26OCnx.js";import"./useApp-DwlOIlXY.js";import"./useRouteRef-ygb9ecnn.js";import"./index-HojQYYpO.js";import"./ArrowForward-BWgfYpnj.js";import"./translation-BVVDPxsW.js";import"./Page-BR2IzY1a.js";import"./useMediaQuery-DZWzmd46.js";import"./Divider-DgNlfm7L.js";import"./ArrowBackIos-49r9wgia.js";import"./ArrowForwardIos-BpH3loED.js";import"./translation-BEHxowIc.js";import"./Modal-BBquywqf.js";import"./Portal-0E-kgImq.js";import"./Backdrop-BnvfdWzz.js";import"./styled-B2hRU9Pw.js";import"./ExpandMore-fAUa6rkR.js";import"./useAsync-NIOp2rsC.js";import"./useMountedState-nYgtVuR7.js";import"./AccordionDetails-DSyZkU1w.js";import"./index-DnL3XN75.js";import"./Collapse-BgsL6NY8.js";import"./ListItem-Dwvy6ya2.js";import"./ListContext-Cn7bnyCl.js";import"./ListItemIcon-C2FYgWxD.js";import"./ListItemText-BtoENYOw.js";import"./Tabs-DXn3jXL7.js";import"./KeyboardArrowRight-DBYmnVj_.js";import"./FormLabel-DNqh8cN2.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DOzzInoz.js";import"./InputLabel-DfiOL0Uz.js";import"./Select-uHHpJ4Uy.js";import"./Popover-B_JVK-ll.js";import"./MenuItem-CdIULn-8.js";import"./Checkbox-SWQwsXQI.js";import"./SwitchBase-BozatXfv.js";import"./Chip-BtC45SWW.js";import"./Link-Cd-y_3kz.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BprdzNtB.js";import"./useIsomorphicLayoutEffect-DKvvtE9T.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CLwpbAHp.js";import"./useDebounce-DnlKeBLb.js";import"./InputAdornment-CcZeD4tQ.js";import"./TextField-CYtj2hWr.js";import"./useElementFilter-D96IJ0zE.js";import"./EmptyState-1ZaZHPyB.js";import"./Progress-DTHiseEy.js";import"./LinearProgress-dVzfCjZ1.js";import"./ResponseErrorPanel-Z1VaAmDH.js";import"./ErrorPanel-BmTSQtWv.js";import"./WarningPanel-DrLC6u8B.js";import"./MarkdownContent-u_spSNfd.js";import"./CodeSnippet-D0jouXxL.js";import"./CopyTextButton-CpIDND41.js";import"./useCopyToClipboard-DsqKZmF6.js";import"./Tooltip-BrI2VFSp.js";import"./Popper-CDaXhOQ8.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
