import{j as t,m as u,I as p,b as g,T as h}from"./iframe-CDMGjht1.js";import{r as x}from"./plugin-SeTjYHS5.js";import{S as l,u as c,a as S}from"./useSearchModal-Qz0h0xLG.js";import{B as m}from"./Button-CJM2mVMw.js";import{a as M,b as C,c as f}from"./DialogTitle-BcD20zOV.js";import{B as j}from"./Box-Dh0DgXaN.js";import{S as n}from"./Grid-BgC6P4wx.js";import{S as y}from"./SearchType-DNianvII.js";import{L as I}from"./List-BZ3qqjn-.js";import{H as B}from"./DefaultResultListItem-BLmQLecI.js";import{s as D,M as G}from"./api-CShczd-4.js";import{S as R}from"./SearchContext-CLEKkWjz.js";import{w as T}from"./appWrappers-CeVFb9Sb.js";import{SearchBar as k}from"./SearchBar-CrtZNNY8.js";import{a as v}from"./SearchResult-BWkS_QbV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BYk3LR2S.js";import"./Plugin-CfrHLNSO.js";import"./componentData-BhfXY_7K.js";import"./useAnalytics-DNi1LI_h.js";import"./useApp-DP3Hy8Yt.js";import"./useRouteRef-BKp3R5P0.js";import"./index-K4DNRamS.js";import"./ArrowForward-BtyH-PNr.js";import"./translation-CMz6apg6.js";import"./Page-CGSjvpq-.js";import"./useMediaQuery-DHHJ8_07.js";import"./Divider-BQTEKmhn.js";import"./ArrowBackIos-BUm1qMck.js";import"./ArrowForwardIos-CsEmCPSV.js";import"./translation-DuEEk0hN.js";import"./Modal-DiZS-g1t.js";import"./Portal-Dv12doci.js";import"./Backdrop-CYAcd77J.js";import"./styled-BhiXTegV.js";import"./ExpandMore-BW8Ytfi4.js";import"./useAsync-F2seOW-M.js";import"./useMountedState-BCg_GyJl.js";import"./AccordionDetails-xoWWWHy1.js";import"./index-B9sM2jn7.js";import"./Collapse-T-NVxaZE.js";import"./ListItem-CGpakNnt.js";import"./ListContext-ak2gE-qF.js";import"./ListItemIcon-DccZo1Co.js";import"./ListItemText-DadlRFVX.js";import"./Tabs-GBem-Rqr.js";import"./KeyboardArrowRight-Bia-86ry.js";import"./FormLabel-BT7ooOKX.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BRa3ION0.js";import"./InputLabel-83Pog1NA.js";import"./Select-BCla9daD.js";import"./Popover-DdPwRKDV.js";import"./MenuItem-Dp_K5hqc.js";import"./Checkbox-B7u2X2cu.js";import"./SwitchBase-DoZWNQU_.js";import"./Chip-BtG5853m.js";import"./Link-D_ooISTq.js";import"./lodash-DLuUt6m8.js";import"./useObservable-BMqS9uye.js";import"./useIsomorphicLayoutEffect-BOxOOV-6.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-DqxFJH0I.js";import"./useDebounce-DqtGuncf.js";import"./InputAdornment-Do4br8Zw.js";import"./TextField-D427viBv.js";import"./useElementFilter-BxLt-OO3.js";import"./EmptyState-DUddTE7P.js";import"./Progress-BhTUHcYp.js";import"./LinearProgress-CDuMq2Wy.js";import"./ResponseErrorPanel-l7hkv1fD.js";import"./ErrorPanel-CHa0fGo8.js";import"./WarningPanel-DI2PepE0.js";import"./MarkdownContent-Cqhsm4_s.js";import"./CodeSnippet-CLIpVCVn.js";import"./CopyTextButton-BUSczag8.js";import"./useCopyToClipboard-Dpkpx4yl.js";import"./Tooltip-CrUID85L.js";import"./Popper-CnWXkGYE.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>T(t.jsx(h,{apis:[[D,new G(b)]],children:t.jsx(R,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=u(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(M,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(k,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(C,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(v,{children:({results:d})=>t.jsx(I,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(B,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(f,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
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
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
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
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
