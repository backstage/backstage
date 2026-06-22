import{bR as t,u as d,l as u,a5 as h}from"./iframe-hQz1Bovf.js";import{r as g}from"./plugin-CXsYH80u.js";import{S as m,u as n,b as x}from"./useSearchModal-COWBIR-k.js";import{B as c}from"./Button-CfoRjWz_.js";import{c as S,b as f,a as M}from"./DialogTitle-D1W8FXLw.js";import{B as j}from"./Box-CFfSeaSI.js";import{S as r}from"./Grid-BHtxnF4E.js";import{S as C}from"./SearchType-BkJ9a1Hq.js";import{L as y}from"./List-Czan3J2f.js";import{H as R}from"./DefaultResultListItem-_H_bKm5c.js";import{O as I}from"./appWrappers-CJxi5nTM.js";import{m as B}from"./makeStyles-CRkWSsAX.js";import{s as D,M as b}from"./api-BZvFwtZ-.js";import{S as k}from"./SearchContext-BHVfRQdn.js";import{SearchBar as v}from"./SearchBar-n8B81nGh.js";import{S as T}from"./SearchResult-BEeQK5f9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0xtEfPb.js";import"./Plugin-HUDQS0ex.js";import"./componentData-sXvL-Mp_.js";import"./useAnalytics-1xUyB9Hg.js";import"./useApp-CNSTaFkm.js";import"./useRouteRef-C1JVUiPG.js";import"./ArrowForward-YyAeGU7-.js";import"./translation-CwwfaMKu.js";import"./Page-6Wa2Eljw.js";import"./useMediaQuery-DCWmJXDR.js";import"./Divider-DiKZVb6z.js";import"./ArrowBackIos-D7jLRDlE.js";import"./ArrowForwardIos-BJjyatSp.js";import"./translation-D_RLyocF.js";import"./Modal-DvhKrn83.js";import"./Portal-CPzfTq6t.js";import"./Backdrop-p8NCbYbL.js";import"./styled-DjRvED2X.js";import"./ExpandMore-Cxdbkgw6.js";import"./useAsync-D_bIKH8Q.js";import"./useMountedState-C3piaHue.js";import"./AccordionDetails-B6N32r7a.js";import"./index-B9sM2jn7.js";import"./Collapse-DtRwyC7m.js";import"./ListItem-Cj74SqHm.js";import"./ListContext-Dkj8oSFA.js";import"./ListItemIcon-DCQWzmKr.js";import"./ListItemText-DkoBDy6-.js";import"./Tabs-CuxGiyPu.js";import"./KeyboardArrowRight-BWKQILKD.js";import"./FormLabel-BlPE50e1.js";import"./formControlState-Dy7ehpEY.js";import"./InputLabel-B7YIE6SD.js";import"./Select-D4kv8PKN.js";import"./Popover-DfiFNTXi.js";import"./MenuItem-DcJ8_era.js";import"./Checkbox-COlZMOxD.js";import"./SwitchBase-BvGKPoaq.js";import"./Chip-VKkLHmRL.js";import"./Link-Bcq4-4Is.js";import"./index-tlBBGTW_.js";import"./lodash-BeTb6-To.js";import"./WebStorage-CyAycpaY.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_qXwQQN.js";import"./useIsomorphicLayoutEffect-DQt7gRcN.js";import"./BUIProvider-DrhB4dcF.js";import"./openLink-B-dyxHNl.js";import"./useResolvedHref-CyacsD8B.js";import"./Search-eywyTF7_.js";import"./useDebounce-Zels7Bk5.js";import"./InputAdornment-D0TGnxaV.js";import"./TextField-BrbndKmz.js";import"./useElementFilter-Dd1GnSA1.js";import"./EmptyState-CBQY7kOH.js";import"./Progress-Dgwx3OCu.js";import"./LinearProgress-CUWHmKoH.js";import"./ResponseErrorPanel-BdMSXBjO.js";import"./ErrorPanel-C9NtZi6r.js";import"./WarningPanel-EdrGZVs0.js";import"./MarkdownContent-bRZBSpSh.js";import"./CodeSnippet-DZEoL2eY.js";import"./CopyTextButton-BuvWXcdK.js";import"./useCopyToClipboard-fpXyZL8l.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
